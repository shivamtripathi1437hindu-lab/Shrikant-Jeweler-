import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MessageCircle, MapPin, Copy, Check, Shield, Gem, Award, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('9167671944');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#050505] border-t border-[#2A261C] text-[#B8B8B8] text-sm mt-20">
      {/* Brand Values Ribbon */}
      <div className="border-b border-[#1C1A14] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-[#F5E6B5]">100% BIS Hallmarked</h5>
              <p className="text-[11px] text-[#8E8B82]">Strict government certified metal purity</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-[#F5E6B5]">Zero-Loss Ledger</h5>
              <p className="text-[11px] text-[#8E8B82]">Documented weights down to 0.001g</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Gem className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-[#F5E6B5]">GIA/IGI Diamonds</h5>
              <p className="text-[11px] text-[#8E8B82]">Ethically sourced conflict-free solitaires</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#D4AF37] shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-[#F5E6B5]">Fair Karigar Wages</h5>
              <p className="text-[11px] text-[#8E8B82]">Dignity and prompt disbursements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Info */}
        <div className="md:col-span-5 space-y-4">
          <Logo size="lg" showText={true} showTagline={true} />
          <p className="text-xs text-[#8E8B82] leading-relaxed max-w-md pt-2">
            Srikanth Ghorai represents a living Indian atelier where master goldsmithing, fair-wage karigar empowerment, and transparent bullion ledgers converge. Every ornament embodies generations of sacred metalcraft.
          </p>
          <p className="text-xs text-[#D4AF37] italic font-serif-luxury">
            "हर ग्राम में हुनर, हर कारीगर की पहचान।"
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-cinzel text-xs font-semibold text-[#F5E6B5] tracking-widest uppercase">
            Atelier Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('home')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('designs')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('jewelleryDesigns')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('workers')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('workersAndJobs')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('workshopDashboard')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('aboutUs')}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {t('contactAndLocation')}
              </button>
            </li>
          </ul>
        </div>

        {/* Verified Business Contact */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-cinzel text-xs font-semibold text-[#F5E6B5] tracking-widest uppercase">
            Verified Contact &amp; Atelier
          </h4>

          <div className="space-y-2.5 text-xs">
            {/* Phone & Copy */}
            <div className="flex items-center justify-between p-2 rounded bg-[#111111] border border-[#222]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <a
                  href="tel:9167671944"
                  className="font-semibold text-[#F5E6B5] hover:underline"
                >
                  +91 9167671944
                </a>
              </div>
              <button
                onClick={handleCopyPhone}
                className="text-[11px] text-[#B8B8B8] hover:text-[#D4AF37] flex items-center gap-1"
                title="Copy Phone Number"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919167671944?text=Hello%20Srikanth%20Ghorai%20Atelier,%20I%20would%20like%20to%20enquire%20about%20jewellery%20and%20workshop%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">Chat on WhatsApp (+91 9167671944)</span>
            </a>

            {/* Address */}
            <div className="flex items-start gap-2 pt-1 text-[#8E8B82]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Near Anil Apartment, Mulund East, Mumbai, Maharashtra, India.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="border-t border-[#1C1A14] py-5 px-4 sm:px-6 text-xs text-[#8E8B82]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} SRIKANTH GHORAI. All rights reserved. Where Every Gram Tells a Story.
          </div>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37]">
              Ethics &amp; Standards
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37]">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37]">
              Terms of Guild
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
