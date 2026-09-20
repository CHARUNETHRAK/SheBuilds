import React from 'react';
import { Play, Sparkles, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { useDemoMode, DemoScenario } from '../features/demomode/DemoModeContext';

interface DemoBarProps {
  onNavigateScenario: (scenario: DemoScenario) => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onNavigateScenario }) => {
  const { isDemoMode, activeScenario, toggleDemoMode, triggerScenario } = useDemoMode();

  const handleRunScenario = (sc: DemoScenario) => {
    triggerScenario(sc);
    onNavigateScenario(sc);
  };

  if (!isDemoMode) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Internship Presentation Mode available:</span>
        </div>
        <button
          onClick={() => toggleDemoMode(true)}
          className="bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-semibold text-[11px] px-3 py-1 rounded-xl transition flex items-center space-x-1"
        >
          <Play className="w-3 h-3" />
          <span>Enable Demo Mode Switcher</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-amber-500/30 px-4 py-3 text-xs space-y-2 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
        <div className="flex items-center space-x-2 text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold">Demonstration data — Not real survivor data</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            DEMO SCENARIO SWITCHER ACTIVE
          </span>
          <button
            onClick={() => toggleDemoMode(false)}
            className="text-slate-400 hover:text-white p-1 rounded transition"
            title="Disable Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 mr-1">Demo Scenarios:</span>
        
        <button
          onClick={() => handleRunScenario('scenario1')}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition flex items-center space-x-1.5 ${
            activeScenario === 'scenario1'
              ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500/40'
          }`}
        >
          <span>Scenario 1: Manipulated Image → DeepDetect → SafeDoc</span>
        </button>

        <button
          onClick={() => handleRunScenario('scenario2')}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition flex items-center space-x-1.5 ${
            activeScenario === 'scenario2'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-rose-500/40'
          }`}
        >
          <span>Scenario 2: Known Hash Match → ShieldScan → Guidance</span>
        </button>

        <button
          onClick={() => handleRunScenario('scenario3')}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition flex items-center space-x-1.5 ${
            activeScenario === 'scenario3'
              ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500/40'
          }`}
        >
          <span>Scenario 3: No Match → SafeDoc → SafeVoice</span>
        </button>

        <button
          onClick={() => handleRunScenario('scenario4')}
          className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition flex items-center space-x-1.5 ${
            activeScenario === 'scenario4'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/40'
          }`}
        >
          <span>Scenario 4: Case Follow-Up → Day 14 → TrustCircle</span>
        </button>
      </div>
    </div>
  );
};
