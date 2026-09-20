import React from 'react';
import { Sun, Cloud, Wind, Thermometer, Newspaper, ArrowRight, Search } from 'lucide-react';

interface NeutralViewProps {
  onRestore?: () => void;
}

export const NeutralView: React.FC<NeutralViewProps> = ({ onRestore }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8">
      {/* Neutral Site Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Daily Weather & Life</h1>
            <p className="text-xs text-slate-400">Local Forecast, News & Everyday Tips</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              className="bg-slate-800 text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none"
            />
          </div>
          {/* Subtle click area to resume if user intentionally wants to go back */}
          <button 
            onClick={onRestore}
            className="text-xs text-slate-600 hover:text-slate-500 transition-colors px-2 py-1 rounded"
            title="Return"
          >
            Ref. 2026
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Card */}
        <div className="lg:col-span-2 bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Live Forecast</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">26°C Sunny</h2>
              <p className="text-slate-400 text-sm">Humidity 45% • Wind 12 km/h • High UV Index</p>
            </div>
            <Sun className="w-16 h-16 text-amber-400 animate-pulse" />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/60 text-center">
            <div>
              <p className="text-xs text-slate-400">Tue</p>
              <Cloud className="w-6 h-6 mx-auto my-2 text-slate-300" />
              <p className="text-sm font-semibold">24°C</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Wed</p>
              <Sun className="w-6 h-6 mx-auto my-2 text-amber-400" />
              <p className="text-sm font-semibold">27°C</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Thu</p>
              <Wind className="w-6 h-6 mx-auto my-2 text-teal-400" />
              <p className="text-sm font-semibold">25°C</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Fri</p>
              <Thermometer className="w-6 h-6 mx-auto my-2 text-rose-400" />
              <p className="text-sm font-semibold">28°C</p>
            </div>
          </div>
        </div>

        {/* Article Widget */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase">
              <Newspaper className="w-4 h-4" />
              <span>Healthy Living</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-2">10 Easy Plant-Based Recipes for Busy Weekdays</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Simple, delicious meals you can prepare in under 20 minutes with basic pantry ingredients.
            </p>
          </div>
          <button className="mt-6 flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300">
            Read Article <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </main>

      {/* Quick Exit Privacy Disclaimer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-4 border-t border-slate-800 text-[11px] text-slate-600 text-center">
        Quick Exit helps rapidly hide ShieldHer from view. Note: Quick Exit cannot erase underlying browser history if your browser logs visited pages.
      </footer>
    </div>
  );
};
