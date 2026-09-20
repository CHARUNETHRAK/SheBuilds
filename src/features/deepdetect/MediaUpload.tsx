import React, { useState } from 'react';
import { Upload, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  maxSizeBytes?: number;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onFileSelect,
  maxSizeBytes = 50 * 1024 * 1024 // 50MB default
}) => {
  const { t } = useLanguage();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];

  const validateAndSelect = (file: File) => {
    setErrorMsg(null);
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Unsupported file type. Please upload a JPEG, PNG, WebP image, or MP4 video.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setErrorMsg(`File size exceeds ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB limit.`);
      return;
    }
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  return (
    <div className="space-y-4">
      {/* Privacy Notice Banner */}
      <div className="p-3.5 bg-slate-950/80 border border-teal-500/30 rounded-xl flex items-center space-x-3 text-xs text-teal-300">
        <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
        <span className="font-medium">
          Your media will be analysed on this device whenever possible. Zero automatic cloud uploads.
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <label
        htmlFor="media-upload-input"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-teal-500/70 rounded-2xl p-8 sm:p-10 block text-center transition bg-slate-950/40 hover:bg-slate-950/80 group"
      >
        <input
          type="file"
          id="media-upload-input"
          accept="image/jpeg,image/png,image/webp,video/mp4"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition border border-teal-500/20">
          <Upload className="w-7 h-7" />
        </div>
        <p className="text-sm font-bold text-white group-hover:text-teal-300 transition">
          {t.uploadMedia}
        </p>
        <p className="text-xs text-slate-400 mt-1.5">
          Supports JPEG, PNG, WebP, MP4 (Max 50MB) • Kept strictly in browser memory
        </p>
      </label>

      {/* Error display */}
      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
