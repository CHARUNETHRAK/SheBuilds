import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, Info, FileCheck } from 'lucide-react';
import { ChecklistItem } from '../../types';

const DEFAULT_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk_1',
    title: 'Preserve Original File',
    description: 'Keep raw uncropped media file without editing, renaming, or screenshotting to preserve EXIF data.',
    completed: true,
    isMandatory: true
  },
  {
    id: 'chk_2',
    title: 'Document Source URL & Web Context',
    description: 'Record original post link, profile handle, or chat export timestamp.',
    completed: true,
    isMandatory: true
  },
  {
    id: 'chk_3',
    title: 'Generate SHA-256 Integrity Hash',
    description: 'Compute client-side cryptographic hash to verify file integrity post-discovery.',
    completed: true,
    isMandatory: true
  },
  {
    id: 'chk_4',
    title: 'Record Discovery Timestamp',
    description: 'Log exact date, time, and timezone when non-consensual media was first seen.',
    completed: true,
    isMandatory: false
  },
  {
    id: 'chk_5',
    title: 'Review Reporting Channels',
    description: 'Check options on StopNCII.org for image hash suppression & Cyber Crime Helpline 1930.',
    completed: false,
    isMandatory: false
  },
  {
    id: 'chk_6',
    title: 'Contact Vetted Support Organization',
    description: 'Reach out to NCW Cyber Cell (7827170170) or Vandrevala Helpline (+91 9999 666 555).',
    completed: false,
    isMandatory: false
  }
];

export const ComplaintChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST_ITEMS);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>Complaint Preparation Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Recommended steps before submitting a cyber crime report.</p>
        </div>

        <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
          {completedCount} of {items.length} Completed
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-3 ${
              item.completed
                ? 'bg-slate-950 border-teal-500/40 text-slate-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {item.completed ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${item.completed ? 'text-white' : 'text-slate-300'}`}>
                  {item.title}
                </span>
                {item.isMandatory && (
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                    Key Step
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statutory Legal References (Configurable) */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
        <p className="font-bold text-white flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-teal-400" />
          <span>Statutory Provisions (India IT Act / BNS)</span>
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          • IT Act Sec 66E: Violation of privacy by capturing or publishing private images without consent.<br />
          • IT Act Sec 67 / 67A: Publishing or transmitting obscene material in electronic form.<br />
          • BNS Sec 77 / 78: Voyeurism and Stalking protections.
        </p>
      </div>
    </div>
  );
};
