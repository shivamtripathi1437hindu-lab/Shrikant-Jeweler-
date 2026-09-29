import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  Scale, 
  Hammer, 
  Users, 
  Award, 
  Sparkles, 
  Layers, 
  HeartHandshake,
  CheckCircle,
  Gem
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Header */}
      <section className="relative rounded-2xl overflow-hidden border border-[#2A261C] bg-[#0E0E0E] p-8 md:p-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181818] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
            ATELIER HERITAGE &amp; PURPOSE
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#FFFFFF] leading-tight">
            Crafting Trust. Connecting Artisans.
          </h1>

          <p className="font-serif-luxury text-lg text-[#D4AF37] italic">
            "हर ग्राम में हुनर, हर कारीगर की पहचान।"
          </p>

          <p className="text-sm text-[#B8B8B8] leading-relaxed">
            Founded by master jeweller <strong>Srikanth Ghorai</strong>, our atelier was born from a singular conviction: that traditional Indian goldsmithing is a sacred heritage, and the artisans who breathe life into precious metal deserve absolute dignity, transparent wages, and immaculate bullion accounting.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('designs')}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all cursor-pointer"
            >
              Explore Our Jewellery
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-[#181818] hover:bg-[#252525] border border-[#332E22] text-[#F5E6B5] text-xs font-semibold rounded transition-all cursor-pointer"
            >
              Contact Our Atelier
            </button>
          </div>
        </div>
      </section>

      {/* The Stakeholder Impact Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">
            WHO WE EMPOWER
          </span>
          <h2 className="font-serif-luxury text-3xl text-[#FFFFFF]">
            A Dignified Ecosystem for Indian Jewellery
          </h2>
          <p className="text-xs text-[#8E8B82]">
            Transforming how bullion flows, how karigars earn, and how connoisseurs commission luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Artisans */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] text-[#D4AF37] flex items-center justify-center border border-[#332E22]">
              <Hammer className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">For Jewellery Artisans</h3>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Guaranteed fair piece-rate and gram-rate wages, zero arbitrary deductions, digital portfolio verification, and immediate voucher disbursements.
            </p>
          </div>

          {/* Goldsmiths */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] text-[#D4AF37] flex items-center justify-center border border-[#332E22]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">For Goldsmiths</h3>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Access to verified master orders, precise casting formulas, ultrasonic scrap recovery standards, and a respected guild network across Mumbai and Bengal.
            </p>
          </div>

          {/* Workshop Owners */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] text-[#D4AF37] flex items-center justify-center border border-[#332E22]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">For Workshop Owners</h3>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              A military-grade gold weight ledger tracking issuance, finished items, scrap, and buffing waste to 0.001g with automated discrepancy flagging.
            </p>
          </div>

          {/* Jewellery Customers */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] text-[#D4AF37] flex items-center justify-center border border-[#332E22]">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">For Jewellery Connoisseurs</h3>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              BIS hallmarked purity, direct artisan transparency, fair making charges without retail markups, and bespoke custom bridal commissions.
            </p>
          </div>
        </div>
      </section>

      {/* The 6 Core Pillars */}
      <section className="bg-[#101010] border border-[#2A261C] rounded-2xl p-8 md:p-12 space-y-8">
        <h2 className="font-serif-luxury text-3xl text-[#FFFFFF] text-center">
          The Srikanth Ghorai Atelier Standard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>100% BIS Hallmarked</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Every creation is certified by Bureau of Indian Standards hallmarking centres with tamper-proof HUID laser engraving.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Transparent Bullion Accounting</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              We separate raw metal weight, stone weight, and making charges cleanly. No bundled pricing or hidden weight inclusions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Zero-Waste Scrap Refining</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Industrial vacuum filters and chemical refining recover every microgram of polishing loss, preventing ecological and economic waste.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Fair Karigar Wages</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Artisans receive standardized guild rates with advance mobilization disbursements and printable physical payment receipts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Conflict-Free Diamonds</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              All natural diamonds are sourced through Kimberly Process certified partners with grading reports from GIA, IGI, or SGL.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Generational Craft Preservation</span>
            </div>
            <p className="text-xs text-[#8E8B82] leading-relaxed">
              Preserving ancient filigree, jadau kundan, and nakshi methods by pairing veteran master craftsmen with modern CAD technology.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Monogram Showcase */}
      <section className="text-center py-6 space-y-4">
        <Logo size="xl" showText={true} showTagline={true} className="justify-center" />
        <p className="text-xs text-[#8E8B82] max-w-md mx-auto pt-2">
          Registered Trademark &amp; Atelier · Mulund East, Mumbai, Maharashtra 400081
        </p>
      </section>
    </div>
  );
};
