import React from 'react';
import { ShieldCheck, HardDrive, UploadCloud, UserCheck, AlertTriangle, UserX, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyIntroPageProps {
  onContinue: () => void;
}

export const PrivacyIntroPage: React.FC<PrivacyIntroPageProps> = ({ onContinue }) => {
  const { t } = useLanguage();

  const principles = [
    {
      icon: <HardDrive className="w-6 h-6 text-teal-400" />,
      title: t.onDeviceProcessingTitle,
      description: t.onDeviceProcessingDesc
    },
    {
      icon: <UploadCloud className="w-6 h-6 text-emerald-400" />,
      title: t.noAutoUploadTitle,
      description: t.noAutoUploadDesc
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-400" />,
      title: t.userControlTitle,
      description: t.userControlDesc
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      title: t.screeningNoticeTitle,
      description: t.screeningNoticeDesc
    },
    {
      icon: <UserX className="w-6 h-6 text-purple-400" />,
      title: t.noPerpTitle,
      description: t.noPerpDesc
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
          Privacy Policy & Principles
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.privacyIntroTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Built around survivor sovereignty: complete data ownership, local computation, and total transparency.
        </p>
      </div>

      <div className="space-y-4">
        {principles.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start space-x-4 shadow-lg"
          >
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
              {item.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-center">
        <button
          onClick={onContinue}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-xl transition"
        >
          <span>Continue to Survivor Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
