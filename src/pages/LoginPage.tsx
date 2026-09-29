import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);
    if (res.success) {
      onNavigate('dashboard');
    } else {
      setError(res.error || 'Failed to sign in.');
    }
  };

  const handleQuickDemoLogin = async (roleType: 'admin' | 'owner' | 'artisan') => {
    if (roleType === 'admin') {
      await login('srikanth@srikanthghorai.com', 'admin123');
      onNavigate('admin');
    } else if (roleType === 'owner') {
      await login('owner@mulundatelier.com', 'owner123');
      onNavigate('dashboard');
    } else {
      await login('subrata@karigarguild.com', 'artisan123');
      onNavigate('workers');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8 bg-[#121212] p-8 md:p-10 rounded-2xl border border-[#2A261C] shadow-2xl relative">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Center Monogram Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#FFFFFF]">
            {t('welcomeBack')}
          </h2>
          <p className="text-xs text-[#8E8B82]">
            {t('signInToAccount')}
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 p-3 rounded text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#8E8B82] mb-1.5 font-medium">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="srikanth@srikanthghorai.com or 9167671944"
                className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[#8E8B82] font-medium">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
              >
                {t('forgotPassword')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-10 py-2.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8B82] hover:text-[#FFFFFF]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded-lg text-xs transition-all shadow-[0_2px_12px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : t('signIn')}
          </button>
        </form>

        {/* Quick Demo Logins for Reviewer */}
        <div className="pt-4 border-t border-[#222] space-y-2">
          <span className="text-[10px] text-[#8E8B82] block text-center uppercase tracking-widest">
            One-Click Persona Test Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 bg-[#181818] hover:bg-[#222] border border-[#332E22] rounded text-[10px] text-[#D4AF37] font-medium transition-colors"
            >
              Master Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('owner')}
              className="py-1.5 px-2 bg-[#181818] hover:bg-[#222] border border-[#332E22] rounded text-[10px] text-[#D5C692] font-medium transition-colors"
            >
              Workshop Owner
            </button>
            <button
              onClick={() => handleQuickDemoLogin('artisan')}
              className="py-1.5 px-2 bg-[#181818] hover:bg-[#222] border border-[#332E22] rounded text-[10px] text-[#B8B8B8] font-medium transition-colors"
            >
              Master Karigar
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-[#8E8B82]">
            {t('noAccount')}{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#D4AF37] font-semibold hover:underline cursor-pointer"
            >
              {t('registerNow')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
