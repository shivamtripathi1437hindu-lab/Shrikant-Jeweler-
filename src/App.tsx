import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { GoldParticleBackground } from './components/GoldParticleBackground';
import { LiveRatesBar } from './components/LiveRatesBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { DesignsPage } from './pages/DesignsPage';
import { WorkersJobsPage } from './pages/WorkersJobsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import { JewelleryDesign } from './types';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedDesignForInspection, setSelectedDesignForInspection] = useState<JewelleryDesign | null>(null);

  // Handle URL hash or back-forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'designs', 'workers', 'dashboard', 'about', 'contact', 'login', 'register', 'forgot-password', 'profile', 'admin'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDesignFromHome = (design: JewelleryDesign) => {
    setSelectedDesignForInspection(design);
    handleNavigate('designs');
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#E5E2E1] flex flex-col relative selection:bg-[#D4AF37] selection:text-[#070707]">
      {/* Ambient Canvas Gold Particle Glow */}
      <GoldParticleBackground />

      {/* Top Bullion Rates Ticker */}
      <LiveRatesBar />

      {/* Sticky Luxury Header */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectDesign={handleSelectDesignFromHome}
          />
        )}

        {currentTab === 'designs' && (
          <DesignsPage
            selectedDesign={selectedDesignForInspection}
            onClearSelectedDesign={() => setSelectedDesignForInspection(null)}
          />
        )}

        {currentTab === 'workers' && (
          <WorkersJobsPage />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage />
        )}

        {currentTab === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}

        {currentTab === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {currentTab === 'admin' && (
          <AdminPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Master Atelier Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky Quick Navigation Bar */}
      <MobileBottomNav currentTab={currentTab} onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
