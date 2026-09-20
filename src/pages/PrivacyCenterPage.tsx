import React, { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Server, Download, Trash2, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { shieldDB } from '../storage/db';

export const PrivacyCenterPage: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ casesCount: 0, evidenceCount: 0 });
  const [consentGiven, setConsentGiven] = useState(false);
  const [exportMessage, setExportMessage] = useState(false);
  const [wipeSuccess, setWipeSuccess] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const cases = await shieldDB.getAllCases();
    const evidence = await shieldDB.getEvidence();
    setStats({ casesCount: cases.length, evidenceCount: evidence.length });
  };

  const handleExportData = async () => {
    const dataStr = await shieldDB.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShieldHer_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMessage(true);
    setTimeout(() => setExportMessage(false), 3000);
  };

  const handleWipeData = async () => {
    if (confirm(t.confirmDelete)) {
      await shieldDB.clearAllLocalData();
      setWipeSuccess(true);
      loadStats();
      setTimeout(() => setWipeSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-3">
        <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{t.privacyCenter}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data audit, consent controls, encrypted export, and total local data wipe.
          </p>
        </div>
      </div>

      {/* On-Device vs Server Transparency Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Data Processing Transparency</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Stays on device */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>{t.whatStaysOnDevice}</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Uploaded survivor photos and video files</li>
              <li>Calculated SHA-256 cryptographic hashes</li>
              <li>EXIF location & camera metadata</li>
              <li>Case files, timeline notes, and perpetrator info</li>
              <li>Personal trusted emergency contacts</li>
            </ul>
          </div>

          {/* Server Transmission */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-slate-400 font-bold">
              <Server className="w-4 h-4 text-blue-400" />
              <span>{t.whatSentToServer}</span>
            </div>
            <p className="text-slate-400 italic">
              Strictly zero default uploads. Future opt-in server checks occur only if explicitly authorized for hash matching.
            </p>
          </div>
        </div>
      </div>

      {/* Consent & Local Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stored Local Data Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">{t.storedDataSummary}</h3>
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>IndexedDB Encrypted Cases:</span>
              <span className="font-bold text-teal-400">{stats.casesCount} Files</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Evidence Records:</span>
              <span className="font-bold text-emerald-400">{stats.evidenceCount} Records</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Encryption Algorithm:</span>
              <span className="font-mono text-slate-400">WebCrypto AES-256-GCM</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportMyData}</span>
            </button>
          </div>

          {exportMessage && (
            <p className="text-xs text-emerald-400 text-center font-medium">Encrypted JSON backup downloaded!</p>
          )}
        </div>

        {/* Complete Local Data Wipe */}
        <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-rose-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Danger Zone - Permanent Data Erasure</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Immediately delete all IndexedDB databases, case files, evidence logs, and local preferences stored on this browser.
          </p>

          <button
            onClick={handleWipeData}
            className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.deleteMyData}</span>
          </button>

          {wipeSuccess && (
            <p className="text-xs text-emerald-400 text-center font-medium">All local survivor data successfully erased.</p>
          )}
        </div>
      </div>
    </div>
  );
};
