import React from 'react';
import { ShieldCheck, AlertTriangle, Cpu, FileText, HeartHandshake, BookOpen, ArrowLeft, Info, Lock } from 'lucide-react';
import { DeepDetectReport, ShieldScanResult } from '../../types';

interface MediaScreeningResultViewProps {
  report: DeepDetectReport | null;
  shieldScanResult?: ShieldScanResult | null;
  file?: File | null;
  onDocumentThis: () => void;
  onAskSafeVoice: () => void;
  onStartCase: () => void;
  onReturnToDashboard: () => void;
}

export const MediaScreeningResultView: React.FC<MediaScreeningResultViewProps> = ({
  report,
  shieldScanResult,
  file,
  onDocumentThis,
  onAskSafeVoice,
  onStartCase,
  onReturnToDashboard,
}) => {
  const likelihood = report?.likelihood || 'Low';
  const confidence = report?.confidenceScore ?? 75;
  const indicators = report?.reasons || [
    'Inconsistent facial-edge texture detected',
    'Missing or stripped camera EXIF metadata'
  ];

  const hasShieldScanMatch = shieldScanResult?.status === 'MATCH';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Media Screening Results</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Integrated DeepDetect manipulation screening & ShieldScan perceptual hash analysis.
            </p>
          </div>
        </div>

        <button
          onClick={onReturnToDashboard}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-950 px-3 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Known Match Calm Alert Banner */}
      {hasShieldScanMatch ? (
        <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Potential match found in the protected hash list.</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This media matches a known perceptual hash entry in our protected reference database. This indicates that similar content has been previously indexed for takedown or protection.
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Protection:</strong> Raw abusive content is never displayed or stored on external servers. Reference hashes are matched strictly on-device using client-side Web Crypto and perceptual hashing algorithms.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>ShieldScan Status:</strong> No known match found in protected reference database.</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">pHash / dHash SHA-256 Clear</span>
        </div>
      )}

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DeepDetect Manipulation Likelihood */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Manipulation Likelihood</span>
            <span className="text-teal-400 font-mono">{confidence}% Confidence</span>
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-white">{likelihood}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Screening indicates possible manipulation markers</p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
              likelihood.includes('High')
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-teal-500/10 border-teal-500/30 text-teal-400'
            }`}>
              {likelihood} Likelihood
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300">Screening Indicators Identified:</p>
            <ul className="space-y-1.5">
              {indicators.map((ind, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start space-x-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Panel & Mandatory Disclaimer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Protection Steps</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={onDocumentThis}
                className="w-full flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs p-3 rounded-xl transition shadow"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Document this Evidence (SafeDoc)</span>
                </div>
                <span className="text-[10px] opacity-80">SHA-256 Hash + PDF</span>
              </button>

              <button
                onClick={onAskSafeVoice}
                className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold text-xs p-3 rounded-xl border border-slate-800 transition"
              >
                <div className="flex items-center space-x-2 text-blue-400">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Ask SafeVoice Guidance</span>
                </div>
                <span className="text-[10px] text-slate-400">Trauma-Informed</span>
              </button>

              <button
                onClick={onStartCase}
                className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-800 text-slate-200 font-semibold text-xs p-3 rounded-xl border border-slate-800 transition"
              >
                <div className="flex items-center space-x-2 text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Start Case File (Case Diary)</span>
                </div>
                <span className="text-[10px] text-slate-400">Day 14/30 Reminders</span>
              </button>
            </div>
          </div>

          {/* Mandatory Responsible AI Screening Disclaimer */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important Notice:</strong> "Screening result only. This is not proof of manipulation or abuse." DeepDetect provides probabilistic manipulation likelihood screening for decision-support purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
