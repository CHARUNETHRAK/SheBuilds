import React, { useState, useEffect } from 'react';
import { Scan, ShieldAlert, Download, EyeOff, Sparkles, CheckCircle2, Lock, ArrowRight, HelpCircle, FileCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { shieldScanService } from './ShieldScanService';
import { stopNCIIProvider } from './StopNCIIProvider';
import { ShieldScanResult } from '../../types';

interface ShieldScanViewProps {
  initialFile?: File | null;
  onProceedToSafeDoc?: () => void;
}

export const ShieldScanView: React.FC<ShieldScanViewProps> = ({ initialFile, onProceedToSafeDoc }) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scrubbedUrl, setScrubbedUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [scanResult, setScanResult] = useState<ShieldScanResult | null>(null);

  const stopNCIIStatus = stopNCIIProvider.getStatus();

  useEffect(() => {
    if (initialFile) {
      handleFileSelected(initialFile);
    }
  }, [initialFile]);

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScrubbedUrl(null);
    setScanResult(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleRunScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    const pHash = await shieldScanService.generatePerceptualHash(selectedFile);
    
    // Simulate community hash match check
    const isMockMatch = selectedFile.name.toLowerCase().includes('match') || selectedFile.name.toLowerCase().includes('known');
    let result: ShieldScanResult;

    if (isMockMatch) {
      result = await shieldScanService.checkCommunityHash('8f3a1b9c4e2d7f0a');
    } else {
      result = await shieldScanService.checkCommunityHash(pHash);
    }

    setScanResult(result);
    setScanning(false);
  };

  const handleScrubMetadata = async () => {
    if (!previewUrl) return;
    setScrubbing(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setScrubbedUrl(URL.createObjectURL(blob));
            setScrubbing(false);
          }
        }, 'image/jpeg', 0.92);
      }
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.shieldscan} - Known Abusive Hash Check</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Client-side perceptual hashing against protected lists without uploading raw media.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <span>StopNCII: {stopNCIIStatus.status}</span>
          </div>
        </div>
      </div>

      {/* File Select */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
        <input
          type="file"
          id="shieldscan-file-input"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <label
          htmlFor="shieldscan-file-input"
          className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-xl p-6 block transition bg-slate-950/40"
        >
          <p className="text-sm font-semibold text-white">
            {selectedFile ? selectedFile.name : 'Select Image for Perceptual Hash Check'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Computes dHash Perceptual Fingerprint On-Device</p>
        </label>

        {previewUrl && !scanResult && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleRunScan}
              disabled={scanning}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
            >
              <Scan className="w-4 h-4" />
              <span>{scanning ? 'Generating Perceptual Hash...' : 'Check Perceptual Hash'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Match Result Screen */}
      {scanResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-teal-400" />
              <span>Perceptual Hash Comparison Result</span>
            </h3>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border ${
                scanResult.status === 'MATCH'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              Status: {scanResult.status}
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-300">{scanResult.message}</p>
            <p className="text-xs font-mono text-teal-300 break-all">
              Perceptual dHash: {scanResult.perceptualHash}
            </p>
          </div>

          {/* StopNCII Status Box */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>StopNCII.org Adapter Status</span>
              <span className="text-amber-400 font-mono text-[11px]">{stopNCIIStatus.status}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Direct StopNCII platform submit adapter interface is prepared for Phase 3 integration.
            </p>
          </div>

          {/* Workflow Action to SafeDoc */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              You can proceed to document evidence in SafeDoc regardless of match status.
            </p>

            <button
              onClick={onProceedToSafeDoc}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow"
            >
              <span>Document in SafeDoc</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
