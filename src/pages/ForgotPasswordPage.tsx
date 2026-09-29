import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Check, ArrowLeft, ShieldCheck } from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (tab: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { resetPasswordRequest } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await resetPasswordRequest(email);
    setLoading(false);
    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6 bg-[#121212] p-8 md:p-10 rounded-2xl border border-[#2A261C] shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="md" showText={false} />
          </div>
          <h2 className="font-serif-luxury text-2xl text-[#FFFFFF]">
            {t('resetPassword')}
          </h2>
          <p className="text-xs text-[#8E8B82]">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 p-3 rounded text-xs text-rose-300">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded text-xs text-emerald-300 flex items-center gap-2.5">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 bg-[#D4AF37] text-[#070707] font-semibold text-xs rounded hover:bg-[#F5E6B5]"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8E8B82] mb-1 font-medium">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded-lg pl-9 pr-3 py-2.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded-lg text-xs transition-all shadow-[0_2px_10px_rgba(212,175,55,0.3)] cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Transmitting Reset Key...' : t('sendResetLink')}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2 text-center text-xs text-[#8E8B82] hover:text-[#D4AF37] flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
