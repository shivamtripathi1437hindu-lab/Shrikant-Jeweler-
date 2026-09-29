import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, Compass, ExternalLink, Check, AlertCircle } from 'lucide-react';
import L from 'leaflet';

interface MapComponentProps {
  isAdminAdjustable?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ isAdminAdjustable = false }) => {
  const { settings, updateSettings } = useData();
  const { t, language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const businessMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isPinAdjustMode, setIsPinAdjustMode] = useState<boolean>(false);

  // Haversine formula to calculate distance between two coordinates in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Custom gold luxury pin icon
    const goldIcon = L.divIcon({
      className: 'custom-gold-marker',
      html: `
        <div style="background: #D4AF37; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(212,175,55,0.6); border: 2px solid #FFFFFF;">
          <div style="transform: rotate(45deg); font-weight: bold; font-size: 11px; color: #070707;">SG</div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });

    const map = L.map(mapContainerRef.current, {
      center: [settings.latitude, settings.longitude],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark-themed tiles for luxury palette
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const marker = L.marker([settings.latitude, settings.longitude], {
      icon: goldIcon,
      draggable: isPinAdjustMode,
    }).addTo(map);

    marker.bindPopup(`
      <div style="padding: 4px; font-family: 'Plus Jakarta Sans', sans-serif;">
        <strong style="color: #D4AF37; font-size: 14px; display: block; margin-bottom: 2px;">${settings.brandName}</strong>
        <p style="font-size: 12px; color: #333; margin: 0; line-height: 1.4;">${settings.address}</p>
        <span style="font-size: 11px; color: #888; display: block; margin-top: 4px;">Mulund East, Mumbai</span>
      </div>
    `);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      updateSettings({ latitude: pos.lat, longitude: pos.lng });
    });

    mapInstanceRef.current = map;
    businessMarkerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker position if settings change
  useEffect(() => {
    if (mapInstanceRef.current && businessMarkerRef.current) {
      businessMarkerRef.current.setLatLng([settings.latitude, settings.longitude]);
      if (isPinAdjustMode) {
        businessMarkerRef.current.dragging?.enable();
      } else {
        businessMarkerRef.current.dragging?.disable();
      }
    }
  }, [settings.latitude, settings.longitude, isPinAdjustMode]);

  // Handle Current Location click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        const distance = calculateDistance(
          userLat,
          userLng,
          settings.latitude,
          settings.longitude
        );
        setDistanceKm(distance);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          // Remove old user marker if present
          if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
          }

          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `
              <div style="background: #3B82F6; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const uMarker = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<strong>Your Current Location</strong><br/>${distance} km from Mulund Atelier`)
            .openPopup();

          userMarkerRef.current = uMarker;

          // Fit bounds to show both markers
          const group = L.featureGroup([businessMarkerRef.current!, uMarker]);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.3));
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(t('locationDenied'));
        } else {
          setLocationError('Unable to retrieve your location. Check your GPS or device permissions.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    settings.address
  )}`;

  return (
    <div className="bg-[#141414] border border-[#2A261C] rounded-xl overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 bg-[#181818] border-b border-[#2A261C] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <span className="text-sm font-semibold text-[#F5E6B5] block">
              {settings.brandName} Atelier
            </span>
            <span className="text-xs text-[#B8B8B8]">{settings.address}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-1.5 bg-[#201F1F] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/15 rounded text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t('calculatingLocation') : t('useCurrentLocation')}</span>
          </button>

          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-[#D4AF37] text-[#070707] hover:bg-[#F5E6B5] rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t('getDirections')}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </a>

          {isAdminAdjustable && (
            <button
              onClick={() => setIsPinAdjustMode(!isPinAdjustMode)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                isPinAdjustMode
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-[#252525] text-[#B8B8B8] border-[#444]'
              }`}
            >
              {isPinAdjustMode ? 'Save Map Pin' : 'Adjust Pin'}
            </button>
          )}
        </div>
      </div>

      {/* Geolocation feedback banner */}
      {distanceKm !== null && (
        <div className="bg-[#1A2518] border-b border-emerald-800/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              {t('distanceToAtelier')}: <strong>{distanceKm} km</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Estimated Travel: ~{Math.round(distanceKm * 2.8)} mins</span>
        </div>
      )}

      {locationError && (
        <div className="bg-[#2D1616] border-b border-rose-900/50 px-4 py-2 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Leaflet Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-80 md:h-96 z-10"
        style={{ minHeight: '300px' }}
      />

      {/* Footer address card */}
      <div className="p-3 bg-[#111111] text-xs text-[#8E8B82] flex flex-wrap justify-between items-center gap-2 border-t border-[#222]">
        <span>Landmark: Near Anil Apartment, Mulund East, Mumbai, Maharashtra 400081</span>
        <span>Coordinates: {settings.latitude.toFixed(4)}° N, {settings.longitude.toFixed(4)}° E</span>
      </div>
    </div>
  );
};
