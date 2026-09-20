import React from 'react';
import { ShieldCheck, Lock, HardDrive, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyBannerProps {
  onOpenPrivacyCenter?: () => void;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ onOpenPrivacyCenter }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-900/80 border border-teal-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                {t.privacyBadge}
              </span>
              <span className="flex items-center text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Web Crypto AES-256
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {t.privacyStatement}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>Local DB</span>
          </div>
          {onOpenPrivacyCenter && (
            <button
              onClick={onOpenPrivacyCenter}
              className="flex items-center space-x-1.5 text-xs font-medium text-teal-300 hover:text-teal-200 bg-teal-950/40 hover:bg-teal-900/50 px-3 py-1.5 rounded-lg border border-teal-500/30 transition"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{t.privacyCenter}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
