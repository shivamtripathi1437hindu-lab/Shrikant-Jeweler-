import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Logo } from '../components/Logo';
import { JewelleryDesign } from '../types';
import { 
  Sparkles, 
  Gem, 
  Hammer, 
  Building2, 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  Phone,
  CheckCircle,
  Clock,
  Layers,
  Award
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectDesign: (design: JewelleryDesign) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectDesign }) => {
  const { t, language } = useLanguage();
  const { designs, goldLedger, workers, jobs } = useData();
  const [selectedSpecimen, setSelectedSpecimen] = useState<JewelleryDesign | null>(null);

  const featuredDesigns = designs.slice(0, 3);

  // Calculate live summary metrics for workshop preview
  const totalGoldBalance = goldLedger.reduce((sum, item) => sum + item.goldIssuedGrams, 0).toFixed(2);
  const activeOrdersCount = jobs.filter(j => j.status === 'In Progress' || j.status === 'Assigned').length;

  return (
    <div className="space-y-20 pb-16">
      {/* Cinematic Luxury Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-[#332E22] bg-[#0E0E0E] p-8 md:p-16 lg:p-20 text-center">
        {/* Subtle radial golden glow and vignetting */}
        <div className="absolute inset-0 bg-radial from-[#D4AF37]/10 via-transparent to-[#070707] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Centered Large SG Emblem */}
          <div className="flex justify-center mb-2">
            <Logo size="xl" showText={false} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181818] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('artisanGuildPill')}</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] tracking-wide leading-tight">
            {language === 'hi' ? 'हर ग्राम में हुनर, हर कारीगर की पहचान।' : 'Where Every Gram Tells a Story.'}
          </h1>

          <p className="text-sm md:text-base text-[#D5C692] max-w-2xl mx-auto leading-relaxed">
            {t('heroSubheadline')}
          </p>

          <p className="text-xs text-[#8E8B82] tracking-wider uppercase">
            ESTD. MUMBAI · MULUND EAST ATELIER · BIS HALLMARK RECOGNISED
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3.5 pt-4">
            <button
              onClick={() => onNavigate('designs')}
              className="px-7 py-3.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-sm font-semibold rounded transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center gap-2 cursor-pointer"
            >
              <Gem className="w-4 h-4" />
              <span>{t('exploreJewellery')}</span>
            </button>

            <button
              onClick={() => onNavigate('workers')}
              className="px-6 py-3.5 bg-[#181818] hover:bg-[#222] border border-[#D4AF37]/50 text-[#F5E6B5] text-sm font-semibold rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <Hammer className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('findKarigar')}</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 bg-[#141414] hover:bg-[#1E1E1E] border border-[#332E22] text-[#E5E2E1] text-sm font-semibold rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('registerWorkshop')}</span>
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3.5 bg-transparent hover:bg-[#181818] text-[#B8B8B8] hover:text-[#D4AF37] text-sm font-semibold rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{t('contactUs')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Workshop Dashboard Preview Metric Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-cinzel text-xs font-semibold text-[#F5E6B5] tracking-widest uppercase">
              Workshop &amp; Vault Reserves Preview
            </h3>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Workshop Operations</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
            <div className="text-xs text-[#8E8B82] mb-1">{t('activeWorkshops')}</div>
            <div className="font-cinzel text-2xl font-bold text-[#F5E6B5]">14 Units</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> 98% On-time Gold Dispatch
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
            <div className="text-xs text-[#8E8B82] mb-1">{t('registeredKarigars')}</div>
            <div className="font-cinzel text-2xl font-bold text-[#F5E6B5]">{workers.length + 182} Artisans</div>
            <div className="text-[11px] text-[#D4AF37] mt-2">
              Micro-Pavé &amp; Nakshi Masters
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
            <div className="text-xs text-[#8E8B82] mb-1">{t('goldLedgerBalance')}</div>
            <div className="font-cinzel text-2xl font-bold text-[#F5E6B5]">{totalGoldBalance} g</div>
            <div className="text-[11px] text-[#D5C692] mt-2">
              Audited 22K/24K Reserve
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
            <div className="text-xs text-[#8E8B82] mb-1">{t('activeCustomOrders')}</div>
            <div className="font-cinzel text-2xl font-bold text-[#F5E6B5]">{activeOrdersCount + 18} Live</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Scheduled for Wedding Season
            </div>
          </div>
        </div>
      </section>

      {/* Curated Masterpieces Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
              HAUTE JOAILLERIE
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
              {t('curatedMasterpieces')}
            </h2>
            <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
              {t('curatedSub')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('designs')}
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFF] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t('viewAllDesigns')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Featured Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDesigns.map((item) => (
            <div
              key={item.id}
              className="group bg-[#111111] rounded-xl overflow-hidden border border-[#2A261C] hover:border-[#D4AF37]/60 transition-all flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-[#181818]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#070707]/85 backdrop-blur-md px-3 py-1 rounded text-[11px] text-[#D4AF37] border border-[#332E22]">
                  {item.purity} · {item.metalWeightGrams}g
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">
                    {language === 'hi' ? item.titleHi : item.title}
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-1.5 line-clamp-2">
                    {language === 'hi' ? item.descriptionHi : item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8E8B82] block">Estimated Value</span>
                    <span className="font-cinzel text-lg font-bold text-[#F5E6B5]">
                      ₹{item.priceEstimate.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDesign(item)}
                    className="px-4 py-2 bg-[#1C1A14] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#070707] text-xs font-semibold rounded border border-[#D4AF37]/50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('inspectAndInquire')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 4-Pillars: Where Every Gram Tells a Story */}
      <section className="bg-[#101010] border border-[#2A261C] rounded-2xl p-8 md:p-14 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">
            ATELIER PROVENANCE
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            The Journey of Every Gram
          </h2>
          <p className="text-xs sm:text-sm text-[#B8B8B8]">
            Transparency is not merely a policy at Srikanth Ghorai; it is our sacred guild discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="bg-[#141414] p-6 rounded-xl border border-[#222] space-y-3 relative">
            <span className="text-xs font-cinzel font-bold text-[#D4AF37]">01</span>
            <h4 className="font-serif-luxury text-lg text-[#F5E6B5]">Bullion Assay &amp; Issuance</h4>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Every bar of 24K raw bullion is digitally weighed to 0.001g and hallmarked before being handed to the assigned karigar.
            </p>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-[#222] space-y-3 relative">
            <span className="text-xs font-cinzel font-bold text-[#D4AF37]">02</span>
            <h4 className="font-serif-luxury text-lg text-[#F5E6B5]">Handcrafted Precision</h4>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Master goldsmiths utilize centuries-old filigree, nakshi, and microscope pavé stone setting techniques under strict environmental controls.
            </p>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-[#222] space-y-3 relative">
            <span className="text-xs font-cinzel font-bold text-[#D4AF37]">03</span>
            <h4 className="font-serif-luxury text-lg text-[#F5E6B5]">Zero-Waste Scrap Recovery</h4>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Ultrasonic dust sweepers, vacuum collection systems, and acid refining guarantee all filing scrap is recovered and reconciled.
            </p>
          </div>

          <div className="bg-[#141414] p-6 rounded-xl border border-[#222] space-y-3 relative">
            <span className="text-xs font-cinzel font-bold text-[#D4AF37]">04</span>
            <h4 className="font-serif-luxury text-lg text-[#F5E6B5]">Guild Ledger Sign-Off</h4>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Both workshop owner and artisan countersign the digital weight certificate, guaranteeing fair compensation and pristine accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
