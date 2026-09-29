import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { MapComponent } from '../components/MapComponent';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  Mail, 
  Upload,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings, submitEnquiry } = useData();

  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    enquiryType: 'Jewellery Design' as any,
    designReference: '',
    message: '',
    referenceImageName: '',
    consent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.phone || !formState.consent) return;

    setIsSubmitting(true);
    await submitEnquiry({
      fullName: formState.fullName,
      phone: formState.phone,
      email: formState.email || undefined,
      enquiryType: formState.enquiryType,
      designReference: formState.designReference || undefined,
      message: `${formState.message}${formState.referenceImageName ? ` [Attached: ${formState.referenceImageName}]` : ''}`,
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setFormState({
      fullName: '',
      phone: '',
      email: '',
      enquiryType: 'Jewellery Design',
      designReference: '',
      message: '',
      referenceImageName: '',
      consent: true,
    });
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  const prefilledWhatsAppUrl = `https://wa.me/${settings.whatsappNumber}?text=Namaste%20Srikanth%20Ghorai%20Atelier.%20I%20would%20like%20to%20consult%20regarding%20jewellery%20and%20workshop%20operations.`;

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-[#2A261C] pb-6">
        <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
          CONCIERGE &amp; ATELIER DIRECTORY
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
          {t('contactHeading')}
        </h1>
        <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
          {t('contactSub')}
        </p>
      </div>

      {/* Grid: Contact Cards & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Communication Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Business Phone Card */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-4">
            <h3 className="font-cinzel text-xs font-semibold text-[#D4AF37] tracking-widest uppercase">
              Direct Atelier Line
            </h3>

            <div className="flex items-center justify-between">
              <a
                href={`tel:${settings.phone}`}
                className="text-2xl font-bold font-cinzel text-[#F5E6B5] hover:text-[#D4AF37] transition-colors"
              >
                +91 {settings.phone}
              </a>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-[#181818] border border-[#332E22] text-xs text-[#B8B8B8] hover:text-[#D4AF37] flex items-center gap-1.5 transition-all"
                title="Copy phone number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : t('copyNumber')}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold text-xs text-center rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('callDirect')}</span>
              </a>

              <a
                href={prefilledWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-[#FFFFFF] font-semibold text-xs text-center rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{t('whatsAppConcierge')}</span>
              </a>
            </div>
          </div>

          {/* Physical Address & Hours */}
          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-4">
            <h3 className="font-cinzel text-xs font-semibold text-[#D4AF37] tracking-widest uppercase">
              Registered Atelier Location
            </h3>

            <div className="flex items-start gap-3 text-xs text-[#E5E2E1]">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#F5E6B5] block text-sm mb-1">{settings.brandName}</strong>
                <span>{settings.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8E8B82] pt-2 border-t border-[#222]">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>{settings.email}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8E8B82] pt-1">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Monday – Saturday: 10:30 AM – 8:30 PM (Sunday by appointment)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Formal Contact & Commission Form */}
        <div className="lg:col-span-7 bg-[#121212] p-6 md:p-8 rounded-xl border border-[#2A261C]">
          <h3 className="font-serif-luxury text-2xl text-[#FFFFFF] mb-1">
            {t('sendMessage')}
          </h3>
          <p className="text-xs text-[#B8B8B8] mb-6">
            Inquire about ready inventory, workshop registration, artisan hiring, or bespoke bridal appointments.
          </p>

          {submittedSuccess ? (
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-5 rounded-lg text-xs text-emerald-300 flex items-center gap-3">
              <Check className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h5 className="font-semibold text-sm">Enquiry Registered</h5>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">
                  {t('enquirySuccess')}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('fullName')} *</label>
                  <input
                    type="text"
                    required
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    placeholder="e.g. Anand Parekh"
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="e.g. 9167671944"
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('email')}</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('enquiryType')}</label>
                  <select
                    value={formState.enquiryType}
                    onChange={(e) => setFormState({ ...formState, enquiryType: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option>Jewellery Design</option>
                    <option>Custom Jewellery Order</option>
                    <option>Find a Karigar</option>
                    <option>Workshop Registration</option>
                    <option>Existing Order</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Order or Design Reference (Optional)</label>
                <input
                  type="text"
                  value={formState.designReference}
                  onChange={(e) => setFormState({ ...formState, designReference: e.target.value })}
                  placeholder="e.g. Chandrakala Choker or ORD-901"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">{t('message')} *</label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="State your exact metal purity requirement, weight preferences, or workshop capacity..."
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Optional Reference Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormState({ ...formState, referenceImageName: file.name });
                  }}
                  className="w-full text-xs text-[#8E8B82]"
                />
                {formState.referenceImageName && (
                  <span className="text-[11px] text-[#D4AF37] block mt-1">
                    Attached file: {formState.referenceImageName}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={formState.consent}
                  onChange={(e) => setFormState({ ...formState, consent: e.target.checked })}
                  className="mt-0.5 rounded text-[#D4AF37] focus:ring-0 bg-[#181818] border-[#333]"
                />
                <label htmlFor="consent" className="text-[11px] text-[#8E8B82] leading-tight">
                  I consent to receive atelier communications, order quotes, and WhatsApp updates from Srikanth Ghorai.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : t('submitEnquiry')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Interactive Location Map Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h2 className="font-serif-luxury text-2xl text-[#FFFFFF]">
              Interactive Atelier Map &amp; Route
            </h2>
            <p className="text-xs text-[#8E8B82]">
              Centred on Near Anil Apartment, Mulund East, Mumbai. Use the locator to calculate exact driving distance.
            </p>
          </div>
        </div>

        <MapComponent />
      </section>
    </div>
  );
};
