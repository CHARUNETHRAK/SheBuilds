import React, { useEffect } from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface QuickExitProps {
  onQuickExit: () => void;
  variant?: 'button' | 'floating' | 'header';
}

export const QuickExit: React.FC<QuickExitProps> = ({ onQuickExit, variant = 'button' }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onQuickExit]);

  if (variant === 'floating') {
    return (
      <button
        onClick={onQuickExit}
        id="quick-exit-floating"
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-4 py-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-500/40"
        title={t.quickExitTip}
      >
        <ShieldAlert className="w-5 h-5" />
        <span className="hidden sm:inline">{t.quickExit} (ESC)</span>
        <span className="sm:hidden">ESC</span>
      </button>
    );
  }

  if (variant === 'header') {
    return (
      <button
        onClick={onQuickExit}
        id="quick-exit-header"
        className="flex items-center space-x-2 bg-rose-600/90 hover:bg-rose-600 text-white font-medium text-xs sm:text-sm px-3 py-1.5 rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
        title={t.quickExitTip}
      >
        <LogOut className="w-4 h-4" />
        <span>{t.quickExit}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onQuickExit}
      id="quick-exit-btn"
      className="inline-flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow focus:outline-none"
    >
      <LogOut className="w-4 h-4" />
      <span>{t.quickExit} (ESC)</span>
    </button>
  );
};
