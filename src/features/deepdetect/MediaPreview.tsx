import React, { useEffect, useState } from 'react';
import { Trash2, FileVideo, FileImage } from 'lucide-react';

interface MediaPreviewProps {
  file: File;
  onClear: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onClear }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate object URL
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    // Clean up / revoke object URL on unmount or file change
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) return null;

  const isVideo = file.type.startsWith('video');

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative group">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1.5 font-medium text-slate-300">
          {isVideo ? <FileVideo className="w-4 h-4 text-blue-400" /> : <FileImage className="w-4 h-4 text-teal-400" />}
          <span className="truncate max-w-xs">{file.name}</span>
        </span>
        <span className="text-[11px] font-mono">{(file.size / 1024).toFixed(1)} KB</span>
      </div>

      <div className="flex justify-center items-center max-h-64 overflow-hidden rounded-xl bg-slate-900 border border-slate-800/80">
        {isVideo ? (
          <video src={objectUrl} controls className="max-h-64 w-full rounded-xl object-contain" />
        ) : (
          <img src={objectUrl} alt="Preview" className="max-h-64 object-contain rounded-xl" />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClear}
          className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove File</span>
        </button>
      </div>
    </div>
  );
};
