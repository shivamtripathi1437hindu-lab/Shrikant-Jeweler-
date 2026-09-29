import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { JewelleryDesign } from '../types';
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  Sparkles, 
  Plus, 
  X, 
  Upload, 
  Send, 
  Check, 
  Scale, 
  Gem,
  Award
} from 'lucide-react';

interface DesignsPageProps {
  selectedDesign: JewelleryDesign | null;
  onClearSelectedDesign: () => void;
}

export const DesignsPage: React.FC<DesignsPageProps> = ({
  selectedDesign: initialSelected,
  onClearSelectedDesign
}) => {
  const { t, language } = useLanguage();
  const { designs, submitEnquiry } = useData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDesignModal, setActiveDesignModal] = useState<JewelleryDesign | null>(initialSelected);
  const [customDesignModalOpen, setCustomDesignModalOpen] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem('sg_fav_designs');
    return saved ? JSON.parse(saved) : [];
  });

  // Form states for enquiries
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Custom design request state
  const [customForm, setCustomForm] = useState({
    fullName: '',
    phone: '',
    targetWeightGrams: 50,
    preferredMetal: '22K Yellow Gold',
    stonePreference: 'Polki Diamonds & Emeralds',
    budgetEstimate: '',
    description: '',
    uploadedImageName: ''
  });
  const [customSubmitted, setCustomSubmitted] = useState(false);

  const toggleFavourite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favourites.includes(id)) {
      updated = favourites.filter(fId => fId !== id);
    } else {
      updated = [...favourites, id];
    }
    setFavourites(updated);
    localStorage.setItem('sg_fav_designs', JSON.stringify(updated));
  };

  const categories = [
    { id: 'all', label: t('allDesigns') },
    { id: 'necklaces', label: t('necklaces') },
    { id: 'rings', label: t('rings') },
    { id: 'earrings', label: t('earrings') },
    { id: 'bangles', label: t('bangles') },
    { id: 'bridal', label: t('bridal') },
    { id: 'traditional', label: t('traditional') },
    { id: 'silver', label: t('silver') },
  ];

  const filteredDesigns = designs.filter(d => {
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      d.title.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.purity.toLowerCase().includes(query) ||
      (d.gemstones && d.gemstones.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.fullName || !enquiryForm.phone) return;

    setIsSubmittingEnquiry(true);
    await submitEnquiry({
      fullName: enquiryForm.fullName,
      phone: enquiryForm.phone,
      email: enquiryForm.email || undefined,
      enquiryType: 'Jewellery Design',
      designReference: activeDesignModal ? `${activeDesignModal.title} (ID: ${activeDesignModal.id})` : 'Catalog Enquiry',
      message: `Enquiring on ${activeDesignModal?.title || 'Design'}. Specs: ${activeDesignModal?.purity}, ${activeDesignModal?.metalWeightGrams}g. Notes: ${enquiryForm.notes}`,
    });

    setIsSubmittingEnquiry(false);
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setActiveDesignModal(null);
      setEnquiryForm({ fullName: '', phone: '', email: '', notes: '' });
    }, 2500);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.fullName || !customForm.phone) return;

    await submitEnquiry({
      fullName: customForm.fullName,
      phone: customForm.phone,
      enquiryType: 'Custom Jewellery Order',
      designReference: `Custom Commission (${customForm.preferredMetal}, ~${customForm.targetWeightGrams}g)`,
      message: `Preferred metal: ${customForm.preferredMetal}. Target weight: ${customForm.targetWeightGrams}g. Stones: ${customForm.stonePreference}. Budget: ${customForm.budgetEstimate || 'Not specified'}. Reference file: ${customForm.uploadedImageName || 'None'}. Details: ${customForm.description}`,
    });

    setCustomSubmitted(true);
    setTimeout(() => {
      setCustomSubmitted(false);
      setCustomDesignModalOpen(false);
      setCustomForm({
        fullName: '',
        phone: '',
        targetWeightGrams: 50,
        preferredMetal: '22K Yellow Gold',
        stonePreference: 'Polki Diamonds & Emeralds',
        budgetEstimate: '',
        description: '',
        uploadedImageName: ''
      });
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Custom Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A261C] pb-6">
        <div>
          <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
            EXQUISITE ATELIER ARCHIVE
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            {t('jewelleryDesigns')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
            Hallmarked bullion creations and certified high-jewellery masterpieces.
          </p>
        </div>

        <button
          onClick={() => setCustomDesignModalOpen(true)}
          className="px-5 py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all shadow-[0_2px_12px_rgba(212,175,55,0.3)] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('requestCustomDesign')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills (functional filter segmented tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                  : 'bg-[#141414] text-[#B8B8B8] hover:text-[#FFFFFF] border border-[#26241E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
          <input
            type="text"
            placeholder="Search gold, rings, emeralds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#2A261C] rounded-lg pl-9 pr-4 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="bg-[#121212] border border-[#222] rounded-xl p-12 text-center text-[#8E8B82] space-y-3">
          <Gem className="w-10 h-10 text-[#444] mx-auto" />
          <p className="text-sm">No designs matched your filter criteria.</p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="text-xs text-[#D4AF37] underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => {
            const isFav = favourites.includes(design.id);
            return (
              <div
                key={design.id}
                onClick={() => setActiveDesignModal(design)}
                className="group bg-[#111111] rounded-xl overflow-hidden border border-[#2A261C] hover:border-[#D4AF37]/60 transition-all flex flex-col cursor-pointer"
              >
                {/* Image & Badges */}
                <div className="relative h-72 overflow-hidden bg-[#181818]">
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#070707]/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#D4AF37] border border-[#332E22]">
                    {design.purity} · {design.metalWeightGrams}g
                  </div>

                  <button
                    onClick={(e) => toggleFavourite(design.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#070707]/80 hover:bg-[#070707] text-[#D4AF37] border border-[#332E22] transition-transform active:scale-90"
                    title="Add to Favourites"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#D4AF37]' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="font-serif-luxury text-xl text-[#F5E6B5] group-hover:text-[#FFFFFF] transition-colors">
                      {language === 'hi' ? design.titleHi : design.title}
                    </h3>
                    <p className="text-xs text-[#8E8B82] mt-1.5 line-clamp-2">
                      {language === 'hi' ? design.descriptionHi : design.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8E8B82] block">Certified Estimate</span>
                      <span className="font-cinzel text-lg font-bold text-[#F5E6B5]">
                        ₹{design.priceEstimate.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDesignModal(design);
                      }}
                      className="px-3.5 py-1.5 bg-[#181818] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#070707] text-xs font-semibold rounded border border-[#D4AF37]/50 transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('inspectAndInquire')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL: DESIGN INSPECTION & ENQUIRY ================= */}
      {activeDesignModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setActiveDesignModal(null);
                if (onClearSelectedDesign) onClearSelectedDesign();
              }}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Product Visual Header */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 h-48 bg-[#181818] rounded-lg overflow-hidden shrink-0 border border-[#2A261C]">
                  <img
                    src={activeDesignModal.imageUrl}
                    alt={activeDesignModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">
                    ATELIER SPECIMEN INSPECTOR
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#FFFFFF]">
                    {language === 'hi' ? activeDesignModal.titleHi : activeDesignModal.title}
                  </h3>
                  <p className="text-xs text-[#B8B8B8] leading-relaxed">
                    {language === 'hi' ? activeDesignModal.descriptionHi : activeDesignModal.description}
                  </p>
                  <div className="font-cinzel text-xl font-bold text-[#F5E6B5] pt-1">
                    ₹{activeDesignModal.priceEstimate.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#181818] p-4 rounded-lg border border-[#2A261C] text-xs">
                <div>
                  <span className="text-[#8E8B82] block">Hallmark Purity</span>
                  <strong className="text-[#F5E6B5]">{activeDesignModal.purity} (BIS 916)</strong>
                </div>
                <div>
                  <span className="text-[#8E8B82] block">Metal Net Weight</span>
                  <strong className="text-[#F5E6B5]">{activeDesignModal.metalWeightGrams} Grams</strong>
                </div>
                <div>
                  <span className="text-[#8E8B82] block">Stone Weight</span>
                  <strong className="text-[#F5E6B5]">
                    {activeDesignModal.stoneWeightCarats ? `${activeDesignModal.stoneWeightCarats} Carats` : 'N/A (Solid Gold)'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#8E8B82] block">Making Charge</span>
                  <strong className="text-[#D4AF37]">{activeDesignModal.makingChargePercent}% Transparent</strong>
                </div>
              </div>

              {activeDesignModal.gemstones && (
                <div className="text-xs text-[#B8B8B8] flex items-center gap-2 bg-[#161616] p-2.5 rounded border border-[#222]">
                  <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Certified Gemstones:</strong> {activeDesignModal.gemstones}</span>
                </div>
              )}

              {/* Instant Enquiry Form */}
              <form onSubmit={handleEnquirySubmit} className="space-y-4 pt-2 border-t border-[#2A261C]">
                <h4 className="text-sm font-semibold text-[#F5E6B5] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Enquire or Book Atelier Consultation</span>
                </h4>

                {enquirySuccess ? (
                  <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t('enquirySuccess')}</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#8E8B82] mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={enquiryForm.fullName}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                          placeholder="e.g. Ramesh Shah"
                          className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#8E8B82] mb-1">Phone Number / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          placeholder="e.g. 9167671944"
                          className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#8E8B82] mb-1">Special Instructions or Custom Size</label>
                      <input
                        type="text"
                        value={enquiryForm.notes}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                        placeholder="e.g. Inquire about matching earrings or custom length"
                        className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingEnquiry ? 'Submitting to Master Atelier...' : 'Submit Design Enquiry to Concierge'}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST CUSTOM DESIGN ================= */}
      {customDesignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-xl w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setCustomDesignModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div>
                <span className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase">
                  BESPOKE COMMISSION
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#FFFFFF]">
                  Request Custom Jewellery Commission
                </h3>
                <p className="text-xs text-[#B8B8B8] mt-1">
                  Upload your reference sketch, photograph, or heirloom concept. Our master karigars will assess the exact metal weight and provide a transparent quote.
                </p>
              </div>

              {customSubmitted ? (
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-5 rounded-lg text-xs text-emerald-300 flex items-center gap-3">
                  <Check className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-sm">Commission Request Dispatched</h5>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      Assigned to Srikanth Ghorai custom workbench queue. Our master craftsman will contact you via WhatsApp shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#8E8B82] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customForm.fullName}
                        onChange={(e) => setCustomForm({ ...customForm, fullName: e.target.value })}
                        placeholder="Full Name"
                        className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8E8B82] mb-1">Phone Number / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={customForm.phone}
                        onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                        placeholder="e.g. 9167671944"
                        className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#8E8B82] mb-1">Preferred Metal Purity</label>
                      <select
                        value={customForm.preferredMetal}
                        onChange={(e) => setCustomForm({ ...customForm, preferredMetal: e.target.value })}
                        className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option>22K Yellow Gold (Hallmark 916)</option>
                        <option>18K Rose Gold</option>
                        <option>18K White Gold</option>
                        <option>950 Platinum</option>
                        <option>92.5 Fine Sterling Silver</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#8E8B82] mb-1">Target Weight (Approx Grams)</label>
                      <input
                        type="number"
                        min="2"
                        step="1"
                        value={customForm.targetWeightGrams}
                        onChange={(e) => setCustomForm({ ...customForm, targetWeightGrams: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8E8B82] mb-1">Reference Image or Sketch (Optional)</label>
                    <div className="border border-dashed border-[#332E22] hover:border-[#D4AF37] rounded-lg p-4 text-center bg-[#181818] transition-colors">
                      <Upload className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
                      <p className="text-xs text-[#B8B8B8]">Click to browse or drop jewellery reference photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCustomForm({ ...customForm, uploadedImageName: file.name });
                        }}
                        className="mt-2 text-xs text-[#8E8B82]"
                      />
                      {customForm.uploadedImageName && (
                        <div className="text-xs text-[#D4AF37] font-semibold mt-1">
                          Attached: {customForm.uploadedImageName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8E8B82] mb-1">Detailed Specifications</label>
                    <textarea
                      rows={3}
                      value={customForm.description}
                      onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                      placeholder="Describe preferred motifs, stone shapes, bangle diameter, or wedding deadline..."
                      className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all cursor-pointer"
                  >
                    Transmit Custom Commission to Master Karigar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
