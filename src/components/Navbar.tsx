import React, { useState } from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Gem,
  Hammer,
  Building2,
  Info,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home'), icon: Sparkles },
    { id: 'designs', label: t('jewelleryDesigns'), icon: Gem },
    { id: 'workers', label: t('workersAndJobs'), icon: Hammer },
    { id: 'dashboard', label: t('workshopDashboard'), icon: LayoutDashboard },
    { id: 'about', label: t('aboutUs'), icon: Info },
    { id: 'contact', label: t('contactAndLocation'), icon: PhoneCall },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-[#2A261C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="hover:opacity-95 transition-opacity text-left cursor-pointer"
        >
          <Logo size="md" showText={true} showTagline={false} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm transition-all duration-200 relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#F5E6B5] font-semibold'
                    : 'text-[#B8B8B8] hover:text-[#D4AF37]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#FFF0B3] to-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Language, Auth & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Hindi / English Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded bg-[#161616] border border-[#332E22] text-xs font-semibold text-[#D4AF37] hover:bg-[#221E14] hover:border-[#D4AF37]/50 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1C1A14] border border-[#D4AF37]/40 text-xs text-[#F5E6B5] hover:border-[#D4AF37] transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#070707] flex items-center justify-center font-bold text-[10px]">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user?.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#141414] border border-[#332E22] rounded-lg shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#222]">
                    <p className="text-xs font-semibold text-[#F5E6B5] truncate">{user?.name}</p>
                    <p className="text-[10px] text-[#8E8B82] uppercase tracking-wider mt-0.5">
                      {user?.role.replace('_', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full px-4 py-2 text-left text-xs text-[#E5E2E1] hover:bg-[#201F1F] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t('profile')}</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full px-4 py-2 text-left text-xs text-[#E5E2E1] hover:bg-[#201F1F] flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t('workshopDashboard')}</span>
                  </button>

                  {user?.role === 'platform_admin' && (
                    <button
                      onClick={() => handleNavClick('admin')}
                      className="w-full px-4 py-2 text-left text-xs text-[#E5E2E1] hover:bg-[#201F1F] flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t('adminDashboard')}</span>
                    </button>
                  )}

                  <div className="border-t border-[#222] my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-[#201F1F] flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="text-xs text-[#E5E2E1] hover:text-[#D4AF37] px-3 py-1.5 transition-colors cursor-pointer"
              >
                {t('login')}
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all shadow-[0_2px_10px_rgba(212,175,55,0.3)] cursor-pointer"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded text-[#E5E2E1] hover:text-[#D4AF37] hover:bg-[#161616] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F0F] border-b border-[#2A261C] px-6 py-5 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 py-2.5 text-left text-sm ${
                  isActive
                    ? 'text-[#F5E6B5] font-semibold bg-[#1C1A14] px-3 rounded'
                    : 'text-[#B8B8B8] hover:text-[#D4AF37] px-3'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#222] flex flex-col gap-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2.5 text-center text-xs text-[#E5E2E1] bg-[#181818] border border-[#332E22] rounded font-semibold"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2.5 text-center text-xs text-[#070707] bg-[#D4AF37] rounded font-semibold"
                >
                  {t('register')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs text-rose-400 bg-[#1D1414] rounded font-semibold"
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
