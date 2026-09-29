import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { User, Phone, Mail, Building2, Hammer, Shield, Check, Globe, LogOut } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { applications, jobs, goldLedger } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    workshopName: user?.workshopName || '',
    workshopAddress: user?.workshopAddress || '',
    bio: user?.bio || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-sm text-[#8E8B82]">Please sign in to view your profile.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold text-xs rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="border-b border-[#2A261C] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
            MEMBER DOSSIER &amp; CREDENTIALS
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            {user.name}
          </h1>
          <p className="text-xs text-[#8E8B82] mt-1 capitalize">
            Role: <strong className="text-[#F5E6B5]">{user.role.replace('_', ' ')}</strong> · Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            onNavigate('home');
          }}
          className="px-4 py-2 bg-[#1C1A14] hover:bg-rose-950 text-rose-400 border border-rose-900/40 rounded text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('logout')}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile dossier updated successfully!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Overview card */}
        <div className="bg-[#121212] p-6 rounded-xl border border-[#2A261C] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1C1A14] border-2 border-[#D4AF37] flex items-center justify-center font-cinzel text-2xl font-bold text-[#F5E6B5]">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-sm text-[#FFFFFF]">{user.name}</h3>
            <p className="text-xs text-[#8E8B82]">{user.email}</p>
            <p className="text-xs text-[#8E8B82]">+91 {user.phone}</p>
          </div>

          <div className="pt-3 border-t border-[#222] text-xs space-y-2">
            <div className="flex justify-between text-[#8E8B82]">
              <span>Language:</span>
              <span className="text-[#D4AF37] font-semibold uppercase">{language}</span>
            </div>
            <div className="flex justify-between text-[#8E8B82]">
              <span>Verification:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Guild Verified
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-2 bg-[#181818] hover:bg-[#222] text-[#D4AF37] border border-[#332E22] rounded text-xs font-semibold transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile Dossier'}
          </button>
        </div>

        {/* Right 2 cols: Profile Form or Details */}
        <div className="md:col-span-2 bg-[#121212] p-6 md:p-8 rounded-xl border border-[#2A261C]">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-[#F5E6B5] mb-2">Edit Account Information</h3>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Workshop / Studio Name</label>
                <input
                  type="text"
                  value={formData.workshopName}
                  onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Workshop Address</label>
                <input
                  type="text"
                  value={formData.workshopAddress}
                  onChange={(e) => setFormData({ ...formData, workshopAddress: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1 font-medium">Artisanal Bio / Notes</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold rounded text-xs hover:bg-[#F5E6B5]"
                >
                  Save Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-[#181818] text-[#B8B8B8] rounded text-xs hover:text-[#FFF]"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#F5E6B5] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Workshop Credentials</span>
                </h3>
                <div className="bg-[#181818] p-4 rounded-lg border border-[#222] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8E8B82]">Workshop Name:</span>
                    <strong className="text-[#E5E2E1]">{user.workshopName || 'Srikanth Ghorai Master Atelier'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8B82]">Location Address:</span>
                    <span className="text-[#E5E2E1]">{user.workshopAddress || 'Near Anil Apartment, Mulund East, Mumbai'}</span>
                  </div>
                  {user.bio && (
                    <div className="pt-2 border-t border-[#2A261C]">
                      <span className="text-[#8E8B82] block mb-1">Guild Bio:</span>
                      <p className="text-[#B8B8B8] leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick links to actions */}
              <div className="pt-4 border-t border-[#222] grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="p-3 bg-[#181818] hover:bg-[#201F1F] border border-[#2A261C] rounded-lg text-left"
                >
                  <span className="font-semibold text-[#F5E6B5] block">Workshop Ledgers</span>
                  <span className="text-[11px] text-[#8E8B82]">Inspect gold balances &amp; payouts</span>
                </button>

                <button
                  onClick={() => onNavigate('workers')}
                  className="p-3 bg-[#181818] hover:bg-[#201F1F] border border-[#2A261C] rounded-lg text-left"
                >
                  <span className="font-semibold text-[#F5E6B5] block">Job Openings</span>
                  <span className="text-[11px] text-[#8E8B82]">Post and review karigar listings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
