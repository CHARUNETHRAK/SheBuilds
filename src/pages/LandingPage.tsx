import React, { useState } from 'react';
import { Shield, ShieldCheck, Lock, ArrowRight, EyeOff, FileText, Cpu, HelpCircle, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PrivacyBanner } from '../components/PrivacyBanner';
import { QuickExit } from '../components/QuickExit';

interface LandingPageProps {
  onStartSafely: () => void;
  onQuickExit: () => void;
  onOpenPrivacyIntro: () => void;
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSafely,
  onQuickExit,
  onOpenPrivacyIntro,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-8 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 px-4">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-300 shadow-xl">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Upload Client-Side Privacy Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.landingHeadline}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.landingDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartSafely}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition"
            >
              <span>{t.startSafely}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition"
            >
              <HelpCircle className="w-5 h-5 text-teal-400" />
              <span>{t.howItWorks}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Privacy Statement Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <PrivacyBanner onOpenPrivacyCenter={() => onNavigate('privacyCenter')} />
      </section>

      {/* Core Capability Cards */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Comprehensive Safety Toolkit</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Designed specifically for digital abuse detection, preservation, and survivor legal support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('deepdetect')}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-teal-400 transition">
              {t.deepdetect}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Screen suspicious media locally on device, compute SHA-256 hashes, and detect manipulation artifacts.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-2">
              <span>Open Tool</span> <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('safedoc')}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-teal-400 transition">
              {t.safedoc}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Preserve structured timestamped evidence logs and generate cyber crime portal complaints.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-2">
              <span>Open Tool</span> <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('safevoice')}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-teal-400 transition">
              {t.safevoice}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trauma-informed step-by-step guidance, legal rights explanations (IT Act), and immediate safety steps.
            </p>
            <div className="flex items-center text-xs font-semibold text-teal-400 pt-2">
              <span>Open Tool</span> <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Explainer Modal */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <span>How ShieldHer Operates</span>
              </h3>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. On-Device Computation:</strong> When you select photos or videos in DeepDetect or ShieldScan, they are analyzed using client-side JavaScript inside your browser. No files are uploaded to cloud servers.
              </p>
              <p>
                <strong>2. Encrypted Local Storage:</strong> All cases, notes, and evidence logs are saved directly to your browser's IndexedDB database using Web Crypto AES-GCM encryption.
              </p>
              <p>
                <strong>3. Instant Quick Exit:</strong> Pressing ESC or clicking Quick Exit instantly switches the interface to a harmless daily weather/news page without leaving sensitive history.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2 rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
