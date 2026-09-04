import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { SignalsPage } from './components/signals/SignalsPage';
import { JournalPage } from './components/journal/JournalPage';
import { MarketWatchPage } from './components/market/MarketWatchPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { CalculatorPage } from './components/calculator/CalculatorPage';
import { AdminPage } from './components/admin/AdminPage';
import { QuickTradeModal } from './components/journal/QuickTradeModal';
import { LoginModal } from './components/auth/LoginModal';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { activeTab, darkMode } = useTrading();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className={`min-h-screen flex bg-[#0D0D0D] text-white font-sans selection:bg-[#F2C94C] selection:text-[#000]`}>
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'signals' && <SignalsPage />}
          {activeTab === 'journal' && <JournalPage />}
          {activeTab === 'market' && <MarketWatchPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'calculator' && <CalculatorPage />}
          {activeTab === 'admin' && <AdminPage />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickTradeModal />
      <LoginModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
}
