import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Gem, Hammer, LayoutDashboard, PhoneCall } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onNavigate }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('home'), icon: Sparkles },
    { id: 'designs', label: t('jewelleryDesigns'), icon: Gem },
    { id: 'workers', label: t('workersAndJobs'), icon: Hammer },
    { id: 'dashboard', label: t('workshopDashboard'), icon: LayoutDashboard },
    { id: 'contact', label: t('contactAndLocation'), icon: PhoneCall },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#2A261C] py-2 px-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] transition-colors ${
                isActive ? 'text-[#D4AF37] font-semibold' : 'text-[#8E8B82]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8E8B82]'}`} />
              <span className="truncate max-w-[55px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
