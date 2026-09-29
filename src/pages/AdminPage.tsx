import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { JewelleryDesign, JobListing } from '../types';
import { 
  ShieldCheck, 
  Gem, 
  Briefcase, 
  MessageSquare, 
  Sliders, 
  MapPin, 
  Activity, 
  Trash2, 
  Plus, 
  Check, 
  X,
  Phone,
  Building2,
  RefreshCw,
  Clock
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (tab: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { 
    designs, 
    addDesign, 
    deleteDesign, 
    jobs, 
    updateJobStatus, 
    enquiries, 
    updateEnquiryStatus, 
    marketRates, 
    updateMarketRateSource, 
    settings, 
    updateSettings, 
    auditLogs 
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'designs' | 'jobs' | 'enquiries' | 'rates' | 'business' | 'audit'>('overview');

  // New design form
  const [newDesignModal, setNewDesignModal] = useState(false);
  const [designForm, setDesignForm] = useState({
    title: '',
    titleHi: '',
    category: 'necklaces' as JewelleryDesign['category'],
    description: '',
    descriptionHi: '',
    purity: '22K' as JewelleryDesign['purity'],
    metalWeightGrams: 50,
    stoneWeightCarats: 0,
    gemstones: '',
    priceEstimate: 350000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    makingChargePercent: 12,
  });

  // Business settings form
  const [businessForm, setBusinessForm] = useState({
    brandName: settings.brandName,
    phone: settings.phone,
    address: settings.address,
    latitude: settings.latitude,
    longitude: settings.longitude,
    email: settings.email,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Rate provider state
  const [rateSourceInput, setRateSourceInput] = useState(marketRates.dataSource);
  const [rateConnected, setRateConnected] = useState(marketRates.isConnected);

  if (!isAdmin && user?.role !== 'platform_admin') {
    return (
      <div className="bg-[#121212] border border-amber-900/40 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4 my-12">
        <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto" />
        <h3 className="font-serif-luxury text-2xl text-[#FFFFFF]">Master Atelier Admin Portal</h3>
        <p className="text-xs text-[#8E8B82]">
          You are currently viewing as {user ? user.role.replace('_', ' ') : 'Guest'}. Please log in with administrator credentials (or click Master Admin demo login on the Sign In page).
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold text-xs rounded hover:bg-[#F5E6B5]"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designForm.title) return;
    addDesign({
      ...designForm,
      metalWeightGrams: Number(designForm.metalWeightGrams),
      priceEstimate: Number(designForm.priceEstimate),
      makingChargePercent: Number(designForm.makingChargePercent),
    });
    setNewDesignModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...businessForm,
      latitude: Number(businessForm.latitude),
      longitude: Number(businessForm.longitude),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Title */}
      <div className="border-b border-[#2A261C] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
            EXECUTIVE CONTROL PANEL
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
            Authorised governance of jewellery catalogues, job moderation, bullion feeds, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1.5">
            <Check className="w-3 h-3" /> System Security Active
          </span>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#222]">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'designs', label: 'Designs Management', icon: Gem },
          { id: 'jobs', label: 'Job Moderation', icon: Briefcase },
          { id: 'enquiries', label: `Customer Enquiries (${enquiries.length})`, icon: MessageSquare },
          { id: 'rates', label: 'Market Rate Config', icon: Sliders },
          { id: 'business', label: 'Business & Map Settings', icon: MapPin },
          { id: 'audit', label: 'Audit Logs', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#070707]'
                  : 'bg-[#141414] text-[#8E8B82] hover:text-[#FFFFFF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
              <span className="text-xs text-[#8E8B82]">Total Jewellery Designs</span>
              <div className="font-cinzel text-2xl font-bold text-[#F5E6B5] mt-1">{designs.length} Items</div>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
              <span className="text-xs text-[#8E8B82]">Active Job Listings</span>
              <div className="font-cinzel text-2xl font-bold text-[#F5E6B5] mt-1">{jobs.length} Openings</div>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
              <span className="text-xs text-[#8E8B82]">Customer Inquiries</span>
              <div className="font-cinzel text-2xl font-bold text-[#D4AF37] mt-1">{enquiries.length} Messages</div>
            </div>
            <div className="bg-[#121212] p-5 rounded-xl border border-[#2A261C]">
              <span className="text-xs text-[#8E8B82]">Audit Events</span>
              <div className="font-cinzel text-2xl font-bold text-emerald-400 mt-1">{auditLogs.length} Events</div>
            </div>
          </div>

          <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-3">
            <h3 className="font-cinzel text-sm font-semibold text-[#F5E6B5] tracking-widest uppercase">
              Recent System Security Audit Trail
            </h3>
            <div className="divide-y divide-[#222] text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex justify-between items-center gap-4">
                  <div>
                    <strong className="text-[#F5E6B5] block">{log.action}</strong>
                    <span className="text-[#8E8B82]">{log.details}</span>
                  </div>
                  <div className="text-right text-[11px] text-[#8E8B82] shrink-0">
                    <div>{log.performedBy}</div>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: DESIGNS ================= */}
      {activeTab === 'designs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[#F5E6B5]">Jewellery Catalogue Management</h3>
            <button
              onClick={() => setNewDesignModal(true)}
              className="px-3.5 py-1.5 bg-[#D4AF37] text-[#070707] rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F5E6B5]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Specimen</span>
            </button>
          </div>

          <div className="bg-[#121212] rounded-xl border border-[#2A261C] overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#181818] text-[#8E8B82] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="p-3.5">Image &amp; Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Purity &amp; Weight</th>
                  <th className="p-3.5 text-right">Price Estimate</th>
                  <th className="p-3.5 text-right">Making %</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201F1F] text-[#E5E2E1]">
                {designs.map((d) => (
                  <tr key={d.id} className="hover:bg-[#181818]/60">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={d.imageUrl} alt={d.title} className="w-10 h-10 object-cover rounded border border-[#333]" />
                      <div>
                        <strong className="text-[#F5E6B5] block">{d.title}</strong>
                        <span className="text-[10px] text-[#8E8B82]">{d.titleHi}</span>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize">{d.category}</td>
                    <td className="p-3.5">{d.purity} · {d.metalWeightGrams}g</td>
                    <td className="p-3.5 text-right font-bold text-[#D4AF37]">₹{d.priceEstimate.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right">{d.makingChargePercent}%</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => deleteDesign(d.id)}
                        className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                        title="Delete Design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB: JOB MODERATION ================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#F5E6B5]">Workshop Job Openings Moderation</h3>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="bg-[#121212] p-4 rounded-xl border border-[#2A261C] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#F5E6B5]">{j.title}</strong>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#1C1A14] text-[#D4AF37] border border-[#332E22]">
                      {j.status}
                    </span>
                  </div>
                  <p className="text-[#8E8B82] mt-1">{j.workshopName} · {j.workshopLocation}</p>
                  <p className="text-[#D5C692] mt-0.5">Proposed: ₹{j.proposedLabourRate} ({j.rateType}) · Progress: {j.progressPercent}%</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateJobStatus(j.id, 'Open', 0)}
                    className="px-2.5 py-1 bg-[#181818] text-[#B8B8B8] hover:text-[#FFF] rounded border border-[#333]"
                  >
                    Set Open
                  </button>
                  <button
                    onClick={() => updateJobStatus(j.id, 'In Progress', 50)}
                    className="px-2.5 py-1 bg-[#181818] text-blue-400 hover:text-blue-300 rounded border border-[#333]"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateJobStatus(j.id, 'Completed', 100)}
                    className="px-2.5 py-1 bg-[#181818] text-emerald-400 hover:text-emerald-300 rounded border border-[#333]"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: ENQUIRIES ================= */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#F5E6B5]">Customer Inquiries Inbox</h3>
          {enquiries.length === 0 ? (
            <div className="p-8 text-center bg-[#121212] rounded-xl border border-[#222] text-[#8E8B82] text-xs">
              No customer inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div key={enq.id} className="bg-[#121212] p-5 rounded-xl border border-[#2A261C] text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-sm text-[#F5E6B5] block">{enq.fullName}</strong>
                      <span className="text-[#8E8B82]">Phone: <strong>{enq.phone}</strong> {enq.email ? `· ${enq.email}` : ''}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      enq.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  <div className="text-[#D5C692] font-medium">Type: {enq.enquiryType} {enq.designReference ? `· Ref: ${enq.designReference}` : ''}</div>
                  <p className="text-[#B8B8B8] leading-relaxed bg-[#181818] p-3 rounded border border-[#222]">
                    {enq.message}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-[#8E8B82]">{new Date(enq.createdAt).toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEnquiryStatus(enq.id, 'In Discussion')}
                        className="px-2.5 py-1 bg-[#1C1A14] text-[#D4AF37] border border-[#332E22] rounded"
                      >
                        In Discussion
                      </button>
                      <button
                        onClick={() => updateEnquiryStatus(enq.id, 'Resolved')}
                        className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: MARKET RATE CONFIG ================= */}
      {activeTab === 'rates' && (
        <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-5 max-w-xl text-xs">
          <h3 className="text-sm font-semibold text-[#F5E6B5]">Bullion Market Rates Provider Configuration</h3>
          <p className="text-[#8E8B82] leading-relaxed">
            Configure the verified gold/silver/diamond market feed provider. Secret keys remain strictly on server functions.
          </p>

          <div>
            <label className="block text-[#8E8B82] mb-1 font-medium">Data Source Provider Name</label>
            <input
              type="text"
              value={rateSourceInput}
              onChange={(e) => setRateSourceInput(e.target.value)}
              className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rate-conn"
              checked={rateConnected}
              onChange={(e) => setRateConnected(e.target.checked)}
              className="rounded text-[#D4AF37] bg-[#181818] border-[#333]"
            />
            <label htmlFor="rate-conn" className="text-[#E5E2E1]">
              Live Connection Status Active (uncheck to show "Live Rates Not Connected")
            </label>
          </div>

          <button
            onClick={() => {
              updateMarketRateSource(rateSourceInput, rateConnected);
              alert('Market rate source updated.');
            }}
            className="px-5 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold rounded hover:bg-[#F5E6B5]"
          >
            Save Provider Configuration
          </button>
        </div>
      )}

      {/* ================= TAB: BUSINESS & MAP SETTINGS ================= */}
      {activeTab === 'business' && (
        <div className="bg-[#121212] p-6 md:p-8 rounded-xl border border-[#2A261C] max-w-2xl text-xs space-y-4">
          <h3 className="text-sm font-semibold text-[#F5E6B5]">Verified Business &amp; Location Map Coordinates</h3>
          <p className="text-[#8E8B82]">
            Update verified business phone, email, and exact Leaflet map coordinates for Mulund East Atelier.
          </p>

          {settingsSaved && (
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded text-emerald-300">
              Settings updated successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">Business Brand Name</label>
              <input
                type="text"
                value={businessForm.brandName}
                onChange={(e) => setBusinessForm({ ...businessForm, brandName: e.target.value })}
                className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Contact Phone Number</label>
                <input
                  type="text"
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Concierge Email</label>
                <input
                  type="email"
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">Business Physical Address</label>
              <input
                type="text"
                value={businessForm.address}
                onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Latitude (Mulund East)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={businessForm.latitude}
                  onChange={(e) => setBusinessForm({ ...businessForm, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Longitude (Mulund East)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={businessForm.longitude}
                  onChange={(e) => setBusinessForm({ ...businessForm, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold rounded hover:bg-[#F5E6B5]"
            >
              Save Business Details &amp; Map Coordinates
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="bg-[#121212] rounded-xl border border-[#2A261C] overflow-hidden">
          <div className="p-4 border-b border-[#222]">
            <h3 className="text-sm font-semibold text-[#F5E6B5]">Cryptographic &amp; Action Audit Log</h3>
          </div>
          <div className="divide-y divide-[#222] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <strong className="text-[#F5E6B5] block">{log.action}</strong>
                  <span className="text-[#B8B8B8]">{log.details}</span>
                </div>
                <div className="text-right text-[11px] text-[#8E8B82] shrink-0">
                  <span className="font-semibold text-[#E5E2E1] block">{log.performedBy}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Design */}
      {newDesignModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-lg w-full p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setNewDesignModal(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-[#FFFFFF] mb-4">Add Jewellery Masterpiece</h3>

            <form onSubmit={handleCreateDesign} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8E8B82] mb-1">Design Title (English) *</label>
                <input
                  type="text"
                  required
                  value={designForm.title}
                  onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Design Title (Hindi)</label>
                <input
                  type="text"
                  value={designForm.titleHi}
                  onChange={(e) => setDesignForm({ ...designForm, titleHi: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Category</label>
                  <select
                    value={designForm.category}
                    onChange={(e) => setDesignForm({ ...designForm, category: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="necklaces">Gold Necklaces</option>
                    <option value="rings">Diamond Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="bangles">Bangles &amp; Bracelets</option>
                    <option value="bridal">Bridal Suites</option>
                    <option value="traditional">Traditional</option>
                    <option value="silver">Silver Artefacts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Purity</label>
                  <select
                    value={designForm.purity}
                    onChange={(e) => setDesignForm({ ...designForm, purity: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="22K">22K (Hallmark 916)</option>
                    <option value="18K">18K (Diamond Wt)</option>
                    <option value="24K">24K Pure</option>
                    <option value="925 Silver">925 Silver</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Metal Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={designForm.metalWeightGrams}
                    onChange={(e) => setDesignForm({ ...designForm, metalWeightGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Price Estimate (₹)</label>
                  <input
                    type="number"
                    value={designForm.priceEstimate}
                    onChange={(e) => setDesignForm({ ...designForm, priceEstimate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Image URL</label>
                <input
                  type="text"
                  value={designForm.imageUrl}
                  onChange={(e) => setDesignForm({ ...designForm, imageUrl: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={designForm.description}
                  onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] text-[#070707] font-semibold rounded hover:bg-[#F5E6B5]"
              >
                Publish Specimen to Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
