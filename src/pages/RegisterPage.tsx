import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Building2, 
  Hammer, 
  Users, 
  Briefcase, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin,
  Check,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('workshop_owner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [langPref, setLangPref] = useState<'en' | 'hi'>('en');

  // Conditional fields
  const [workshopName, setWorkshopName] = useState('');
  const [workshopAddress, setWorkshopAddress] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Goldsmithing']);
  const [experienceYears, setExperienceYears] = useState<number>(10);
  const [serviceArea, setServiceArea] = useState('Mumbai, Maharashtra');

  const [termsAgreed, setTermsAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const availableSkills = [
    'Goldsmithing',
    'Diamond Setting',
    'Stone Setting',
    'Polishing',
    'Casting',
    'Jewellery Finishing',
    'Jewellery Repair',
    'Custom Jewellery Making',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!termsAgreed) {
      setError('Please accept the guild terms of service.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      role,
      language: langPref,
      workshopName: role === 'workshop_owner' || role === 'workshop_manager' ? workshopName : undefined,
      workshopAddress: role === 'workshop_owner' || role === 'workshop_manager' ? workshopAddress : undefined,
      skills: role === 'jewellery_artisan' ? selectedSkills : undefined,
      experienceYears: role === 'jewellery_artisan' ? experienceYears : undefined,
      serviceArea: role === 'jewellery_artisan' ? serviceArea : undefined,
    });

    setLoading(false);

    if (res.success) {
      if (role === 'jewellery_artisan') {
        onNavigate('workers');
      } else if (role === 'customer') {
        onNavigate('designs');
      } else {
        onNavigate('dashboard');
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl space-y-8 bg-[#121212] p-8 md:p-10 rounded-2xl border border-[#2A261C] shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#FFFFFF]">
            {t('registerTitle')}
          </h2>
          <p className="text-xs text-[#8E8B82]">
            Join Srikanth Ghorai verified artisan and workshop network
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 p-3 rounded text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#8E8B82]">
            {t('selectRole')}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRole('workshop_owner')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                role === 'workshop_owner'
                  ? 'bg-[#1C1A14] border-[#D4AF37] text-[#F5E6B5]'
                  : 'bg-[#161616] border-[#222] text-[#8E8B82] hover:text-[#FFF]'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${role === 'workshop_owner' ? 'text-[#D4AF37]' : ''}`} />
              <div>
                <strong className="block text-xs">{t('workshopOwner')}</strong>
                <span className="text-[10px] text-[#8E8B82]">Manage gold ledger &amp; workers</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('workshop_manager')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                role === 'workshop_manager'
                  ? 'bg-[#1C1A14] border-[#D4AF37] text-[#F5E6B5]'
                  : 'bg-[#161616] border-[#222] text-[#8E8B82] hover:text-[#FFF]'
              }`}
            >
              <Briefcase className={`w-4 h-4 shrink-0 mt-0.5 ${role === 'workshop_manager' ? 'text-[#D4AF37]' : ''}`} />
              <div>
                <strong className="block text-xs">{t('workshopManager')}</strong>
                <span className="text-[10px] text-[#8E8B82]">Accountant &amp; labour payouts</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('jewellery_artisan')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                role === 'jewellery_artisan'
                  ? 'bg-[#1C1A14] border-[#D4AF37] text-[#F5E6B5]'
                  : 'bg-[#161616] border-[#222] text-[#8E8B82] hover:text-[#FFF]'
              }`}
            >
              <Hammer className={`w-4 h-4 shrink-0 mt-0.5 ${role === 'jewellery_artisan' ? 'text-[#D4AF37]' : ''}`} />
              <div>
                <strong className="block text-xs">{t('jewelleryArtisan')}</strong>
                <span className="text-[10px] text-[#8E8B82]">Find jobs &amp; track gold balances</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-[#1C1A14] border-[#D4AF37] text-[#F5E6B5]'
                  : 'bg-[#161616] border-[#222] text-[#8E8B82] hover:text-[#FFF]'
              }`}
            >
              <Users className={`w-4 h-4 shrink-0 mt-0.5 ${role === 'customer' ? 'text-[#D4AF37]' : ''}`} />
              <div>
                <strong className="block text-xs">{t('customer')}</strong>
                <span className="text-[10px] text-[#8E8B82]">Commission bridal jewellery</span>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">{t('fullName')} *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Shah"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">{t('phone')} *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9167671944"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">{t('emailOrPhone')} *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">Language Preference</label>
              <select
                value={langPref}
                onChange={(e) => setLangPref(e.target.value as any)}
                className="w-full bg-[#181818] border border-[#2A261C] rounded-lg px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          {/* Conditional: Workshop details */}
          {(role === 'workshop_owner' || role === 'workshop_manager') && (
            <div className="p-4 bg-[#161616] rounded-lg border border-[#2A261C] space-y-3">
              <h4 className="text-xs font-semibold text-[#F5E6B5]">Workshop Verification Details</h4>
              <div>
                <label className="block text-[#8E8B82] mb-1">{t('workshopName')} *</label>
                <input
                  type="text"
                  required
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="e.g. Mulund Heritage Atelier Unit"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#8E8B82] mb-1">{t('workshopAddress')} *</label>
                <input
                  type="text"
                  required
                  value={workshopAddress}
                  onChange={(e) => setWorkshopAddress(e.target.value)}
                  placeholder="Near Anil Apartment, Mulund East, Mumbai"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Conditional: Artisan details */}
          {role === 'jewellery_artisan' && (
            <div className="p-4 bg-[#161616] rounded-lg border border-[#2A261C] space-y-3">
              <h4 className="text-xs font-semibold text-[#F5E6B5]">Artisanal Craft Credentials</h4>
              <div>
                <label className="block text-[#8E8B82] mb-1">{t('skills')}</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className={`px-2.5 py-1 rounded text-[10px] transition-colors ${
                        selectedSkills.includes(s)
                          ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                          : 'bg-[#181818] text-[#8E8B82] border border-[#333]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('experienceYears')}</label>
                  <input
                    type="number"
                    min="1"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8E8B82] mb-1">{t('serviceArea')}</label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">{t('password')} *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="reg-terms"
              required
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 rounded text-[#D4AF37] focus:ring-0 bg-[#181818] border-[#333]"
            />
            <label htmlFor="reg-terms" className="text-[11px] text-[#8E8B82]">
              {t('iAgreeTerms')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded-lg text-xs transition-all shadow-[0_2px_12px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Atelier Account...' : t('createAccount')}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#8E8B82]">
            {t('alreadyHaveAccount')}{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#D4AF37] font-semibold hover:underline cursor-pointer"
            >
              {t('signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
