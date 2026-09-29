import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { RefreshCw, TrendingUp, Sparkles, Scale, Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const LiveRatesBar: React.FC = () => {
  const { marketRates, refreshMarketRates } = useData();
  const { t, language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Calculator state
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const [calcPurity, setCalcPurity] = useState<'24k' | '22k' | '18k'>('22k');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshMarketRates();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getEstimatedPrice = () => {
    const rate = calcPurity === '24k' 
      ? marketRates.gold24k.ratePerGram 
      : calcPurity === '22k' 
        ? marketRates.gold22k.ratePerGram 
        : marketRates.gold18k.ratePerGram;
    const base = calcGrams * rate;
    const making = base * 0.12; // 12% standard benchmark making charges
    const gst = (base + making) * 0.03; // 3% GST standard in India
    return {
      base: Math.round(base),
      making: Math.round(making),
      gst: Math.round(gst),
      total: Math.round(base + making + gst)
    };
  };

  const calcResult = getEstimatedPrice();

  return (
    <>
      <div className="bg-[#0B0B0B] border-b border-[#2A261C] py-2 px-4 text-xs select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          {/* Status & Label */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${marketRates.isConnected ? 'bg-[#D4AF37]' : 'bg-amber-500'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${marketRates.isConnected ? 'bg-[#D4AF37]' : 'bg-amber-500'}`}></span>
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="text-[#D4AF37] font-semibold hover:underline flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{t('liveRatesTitle')}</span>
            </button>
          </div>

          {/* Rates Ticker */}
          <div className="flex items-center gap-6 text-[#E5E2E1] shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[#B8B8B8]">{t('gold24k')} (10g):</span>
              <span className="font-semibold text-[#F5E6B5]">₹{marketRates.gold24k.ratePer10Gram.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-400 flex items-center">
                <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />+₹{marketRates.gold24k.change24h}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#B8B8B8]">{t('gold22k')} (10g):</span>
              <span className="font-semibold text-[#F5E6B5]">₹{marketRates.gold22k.ratePer10Gram.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-400">+₹{marketRates.gold22k.change24h}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#B8B8B8]">{t('gold18k')} (10g):</span>
              <span className="font-semibold text-[#F5E6B5]">₹{marketRates.gold18k.ratePer10Gram.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#B8B8B8]">{t('silverRate')} (1kg):</span>
              <span className="font-semibold text-[#F5E6B5]">₹{marketRates.silverKg.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#B8B8B8]">{t('diamondRate')}:</span>
              <span className="font-semibold text-[#F5E6B5]">₹{marketRates.diamondPerCaratVS1.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-[#D4AF37]">(VS1)</span>
            </div>
          </div>

          {/* Action & Timestamp */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-[10px] text-[#8E8B82] hidden md:inline">
              {t('lastUpdated')}: {marketRates.lastUpdated}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title={t('refreshRates')}
              className="p-1 rounded bg-[#181818] border border-[#332E22] text-[#D4AF37] hover:bg-[#252219] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 transition-all"
            >
              {language === 'hi' ? 'कैलकुलेटर' : 'Calculator'}
            </button>
          </div>
        </div>
      </div>

      {/* Market Rates & Purity Breakdown Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="font-cinzel text-xl text-[#F5E6B5]">
                {language === 'hi' ? 'लाइव बुलियन व आभूषण मूल्यांकन' : 'Live Bullion & Jewellery Valuation'}
              </h3>
            </div>
            <p className="text-xs text-[#B8B8B8] mb-6">
              {marketRates.dataSource} · {t('lastUpdated')}: {marketRates.lastUpdated}
            </p>

            {/* Rates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-[#181818] p-3.5 rounded border border-[#2A261C]">
                <div className="text-xs text-[#B8B8B8]">{t('gold24k')} (999 Pure)</div>
                <div className="text-lg font-bold text-[#F5E6B5] mt-1">₹{marketRates.gold24k.ratePerGram} <span className="text-xs font-normal text-[#8E8B82]">/ g</span></div>
                <div className="text-xs text-[#D4AF37]">₹{marketRates.gold24k.ratePer10Gram.toLocaleString('en-IN')} / 10g</div>
              </div>

              <div className="bg-[#181818] p-3.5 rounded border border-[#2A261C]">
                <div className="text-xs text-[#B8B8B8]">{t('gold22k')} (916 Hallmark)</div>
                <div className="text-lg font-bold text-[#F5E6B5] mt-1">₹{marketRates.gold22k.ratePerGram} <span className="text-xs font-normal text-[#8E8B82]">/ g</span></div>
                <div className="text-xs text-[#D4AF37]">₹{marketRates.gold22k.ratePer10Gram.toLocaleString('en-IN')} / 10g</div>
              </div>

              <div className="bg-[#181818] p-3.5 rounded border border-[#2A261C]">
                <div className="text-xs text-[#B8B8B8]">{t('gold18k')} (750 Diamond Wt)</div>
                <div className="text-lg font-bold text-[#F5E6B5] mt-1">₹{marketRates.gold18k.ratePerGram} <span className="text-xs font-normal text-[#8E8B82]">/ g</span></div>
                <div className="text-xs text-[#D4AF37]">₹{marketRates.gold18k.ratePer10Gram.toLocaleString('en-IN')} / 10g</div>
              </div>

              <div className="bg-[#181818] p-3.5 rounded border border-[#2A261C]">
                <div className="text-xs text-[#B8B8B8]">{t('silverRate')} (92.5 Fine)</div>
                <div className="text-lg font-bold text-[#F5E6B5] mt-1">₹{marketRates.silverGram} <span className="text-xs font-normal text-[#8E8B82]">/ g</span></div>
                <div className="text-xs text-[#D4AF37]">₹{marketRates.silverKg.toLocaleString('en-IN')} / kg</div>
              </div>

              <div className="bg-[#181818] p-3.5 rounded border border-[#2A261C] col-span-2 sm:col-span-2">
                <div className="text-xs text-[#B8B8B8]">Natural Certified Diamond (Per 1.00 Carat)</div>
                <div className="flex justify-between items-baseline mt-1">
                  <div>
                    <span className="text-xs text-[#8E8B82]">VVS1: </span>
                    <strong className="text-sm text-[#F5E6B5]">₹{marketRates.diamondPerCaratVVS1.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-[#8E8B82]">VS1: </span>
                    <strong className="text-sm text-[#F5E6B5]">₹{marketRates.diamondPerCaratVS1.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-[#8E8B82]">SI1: </span>
                    <strong className="text-sm text-[#F5E6B5]">₹{marketRates.diamondPerCaratSI1.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Jewellery Estimator */}
            <div className="bg-[#161616] p-4 rounded-lg border border-[#332E22] mb-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#F5E6B5] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  {language === 'hi' ? 'त्वरित आभूषण लागत अनुमानक' : 'Instant Jewellery Estimate Calculator'}
                </h4>
                <span className="text-[10px] text-[#8E8B82]">Formula: Metal + 12% Making + 3% GST</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#B8B8B8] mb-1">
                    {language === 'hi' ? 'वजन (ग्राम)' : 'Weight in Grams'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={calcGrams}
                    onChange={(e) => setCalcGrams(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0E0E0E] border border-[#2A261C] rounded px-3 py-2 text-sm text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#B8B8B8] mb-1">
                    {language === 'hi' ? 'शुद्धता' : 'Gold Purity'}
                  </label>
                  <select
                    value={calcPurity}
                    onChange={(e) => setCalcPurity(e.target.value as any)}
                    className="w-full bg-[#0E0E0E] border border-[#2A261C] rounded px-3 py-2 text-sm text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="24k">24K (99.9% Pure Bar/Coin)</option>
                    <option value="22k">22K (91.6% Hallmark Jewellery)</option>
                    <option value="18k">18K (75.0% Diamond Setting)</option>
                  </select>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="bg-[#0E0E0E] p-3 rounded border border-[#222] text-xs space-y-1.5">
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Raw Metal ({calcGrams}g @ ₹{calcPurity === '24k' ? marketRates.gold24k.ratePerGram : calcPurity === '22k' ? marketRates.gold22k.ratePerGram : marketRates.gold18k.ratePerGram}/g):</span>
                  <span className="font-semibold text-[#E5E2E1]">₹{calcResult.base.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Artisan Making Charges (~12%):</span>
                  <span>₹{calcResult.making.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Applicable GST (3%):</span>
                  <span>₹{calcResult.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#F5E6B5] pt-2 border-t border-[#2A261C]">
                  <span>Estimated Total:</span>
                  <span className="text-[#D4AF37] text-base">₹{calcResult.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="bg-[#1A1813] border border-[#52441A] p-3 rounded text-xs text-[#D5C692] flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-[#D4AF37] mt-0.5" />
              <p className="leading-relaxed">
                {t('ratesDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
