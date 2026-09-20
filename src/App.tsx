import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { QuickExit } from './components/QuickExit';
import { NeutralView } from './components/NeutralView';
import { DemoBar } from './components/DemoBar';
import { DemoModeProvider, useDemoMode, DemoScenario } from './features/demomode/DemoModeContext';
import { LandingPage } from './pages/LandingPage';
import { PrivacyIntroPage } from './pages/PrivacyIntroPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';

import { DeepDetectView } from './features/deepdetect/DeepDetectView';
import { ShieldScanView } from './features/shieldscan/ShieldScanView';
import { SafeDocView } from './features/safedoc/SafeDocView';
import { SafeVoiceView } from './features/safevoice/SafeVoiceView';
import { CaseDiaryView } from './features/casediary/CaseDiaryView';
import { TrustCircleView } from './features/trustcircle/TrustCircleView';
import { ResponsibleAIView } from './features/responsibleai/ResponsibleAIView';
import { DeepDetectReport } from './types';

export function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isQuickExitActive, setIsQuickExitActive] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [activeReport, setActiveReport] = useState<DeepDetectReport | null>(null);

  const handleQuickExit = () => {
    setIsQuickExitActive(true);
    document.title = 'Weather & Daily Life Updates';
  };

  const handleRestoreFromQuickExit = () => {
    setIsQuickExitActive(false);
    document.title = 'ShieldHer - Digital Safety Toolkit';
  };

  const handleDemoScenarioNavigation = (scenario: DemoScenario) => {
    switch (scenario) {
      case 'scenario1':
        setActiveTab('deepdetect');
        break;
      case 'scenario2':
        setActiveTab('shieldscan');
        break;
      case 'scenario3':
        setActiveTab('safedoc');
        break;
      case 'scenario4':
        setActiveTab('casediary');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  if (isQuickExitActive) {
    return <NeutralView onRestore={handleRestoreFromQuickExit} />;
  }

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onStartSafely={() => setActiveTab('intro')}
            onQuickExit={handleQuickExit}
            onOpenPrivacyIntro={() => setActiveTab('intro')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'intro':
        return <PrivacyIntroPage onContinue={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'deepdetect':
        return (
          <DeepDetectView
            onNavigateToEvidence={() => setActiveTab('safedoc')}
            onProceedToShieldScan={(file, report) => {
              setActiveFile(file);
              setActiveReport(report);
              setActiveTab('shieldscan');
            }}
          />
        );
      case 'shieldscan':
        return (
          <ShieldScanView
            initialFile={activeFile}
            onProceedToSafeDoc={() => setActiveTab('safedoc')}
          />
        );
      case 'safedoc':
        return <SafeDocView />;
      case 'safevoice':
        return <SafeVoiceView />;
      case 'casediary':
        return <CaseDiaryView />;
      case 'trustcircle':
        return <TrustCircleView />;
      case 'responsibleai':
        return <ResponsibleAIView />;
      case 'privacyCenter':
        return <PrivacyCenterPage />;
      default:
        return (
          <LandingPage
            onStartSafely={() => setActiveTab('intro')}
            onQuickExit={handleQuickExit}
            onOpenPrivacyIntro={() => setActiveTab('intro')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Demo Switcher Bar */}
      <DemoBar onNavigateScenario={handleDemoScenarioNavigation} />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickExit={handleQuickExit}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderCurrentView()}
      </main>

      {/* Persistent Floating Quick Exit Button */}
      <QuickExit onQuickExit={handleQuickExit} variant="floating" />

      {/* Discreet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>ShieldHer Digital Safety Toolkit • On-Device Confidentiality</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('responsibleai')} className="hover:text-slate-300 transition">
              Responsible AI
            </button>
            <button onClick={() => setActiveTab('privacyCenter')} className="hover:text-slate-300 transition">
              Privacy Center
            </button>
            <button onClick={() => setActiveTab('intro')} className="hover:text-slate-300 transition">
              Privacy Principles
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DemoModeProvider>
        <AppContent />
      </DemoModeProvider>
    </LanguageProvider>
  );
}

