import React from 'react';
import { Cpu, ShieldCheck, Lock } from 'lucide-react';

interface ProcessingStateProps {
  progress: number;
  stageMessage: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ progress, stageMessage }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-xl">
      <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto border border-teal-500/20 animate-pulse">
        <Cpu className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-white">Analysing privately on your device...</h3>
        <p className="text-xs text-slate-400">{stageMessage}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-medium px-1">
          <span>Local Engine Processing</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="inline-flex items-center space-x-1.5 text-[11px] text-teal-300 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
        <Lock className="w-3 h-3 text-emerald-400" />
        <span>Media bytes remain strictly in browser JS memory</span>
      </div>
    </div>
  );
};
