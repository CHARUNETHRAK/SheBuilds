import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck, Info, HardDrive, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { DeepDetectReport } from '../../types';

interface ResultScreenProps {
  report: DeepDetectReport;
  onSaveToEvidence: () => void;
  onProceedToShieldScan: () => void;
  savedSuccess?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  report,
  onSaveToEvidence,
  onProceedToShieldScan,
  savedSuccess = false
}) => {
  const getLikelihoodBadgeStyle = (likelihood: string) => {
    switch (likelihood) {
      case 'High':
      case 'Medium-High':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Low':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header & Processing Location Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              DeepDetect Screening Report
            </span>
            {report.isDemoModel && (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Demo Model
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-white mt-1">Manipulation Likelihood Overview</h3>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shrink-0">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          <span>{report.processingLocation}</span>
        </div>
      </div>

      {/* Main Likelihood & Confidence Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Likelihood Card */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Manipulation Likelihood</p>
            <p className="text-2xl font-black text-white mt-1">{report.likelihood}</p>
          </div>
          <span className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border ${getLikelihoodBadgeStyle(report.likelihood)}`}>
            {report.likelihood} Likelihood
          </span>
        </div>

        {/* Confidence Card */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confidence Score</p>
            <p className="text-2xl font-black text-white mt-1">{report.confidenceScore}%</p>
          </div>
          <div className="w-16 bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-teal-400 h-full rounded-full"
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Possible Indicators */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <Info className="w-4 h-4 text-teal-400" />
          <span>Possible Indicators Detected</span>
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {report.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-teal-400 font-bold">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Technical Findings (Metadata & Face Consistency) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Metadata Findings */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Embedded Metadata Findings</p>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span>EXIF Presence:</span>
              <span className={report.metadataFindings.exifPresent ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                {report.metadataFindings.exifPresent ? 'Present' : 'Not Found'}
              </span>
            </p>
            {report.metadataFindings.rawFindings.map((finding, idx) => (
              <p key={idx} className="text-slate-400 text-[11px]">• {finding}</p>
            ))}
          </div>
        </div>

        {/* Face & Boundary Consistency */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Facial & Boundary Consistency</p>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span>Facial Boundary Anomalies:</span>
              <span className={report.faceConsistencyFindings.boundaryAnomalies ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                {report.faceConsistencyFindings.boundaryAnomalies ? 'Detected' : 'None'}
              </span>
            </p>
            {report.faceConsistencyFindings.details.map((detail, idx) => (
              <p key={idx} className="text-slate-400 text-[11px]">• {detail}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 bg-slate-950 border border-teal-500/20 rounded-xl flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">Disclaimer</p>
          <p className="leading-relaxed text-slate-300 font-medium">
            "{report.disclaimer}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          {savedSuccess ? (
            <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report saved to local evidence</span>
            </span>
          ) : (
            <button
              onClick={onSaveToEvidence}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              Save Report to Evidence
            </button>
          )}
        </div>

        <button
          onClick={onProceedToShieldScan}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition"
        >
          <span>Continue to ShieldScan Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
