import React from 'react';
import { CheckCircle2, Clock, Calendar, FileCheck, ShieldCheck, Cpu, FileText, CheckSquare } from 'lucide-react';

export interface TimelineStep {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  completedAt?: string;
  icon: React.ReactNode;
}

interface EvidenceTimelineProps {
  currentStepIndex?: number;
  discoveryDate?: string;
  capturedDate?: string;
  hasHash?: boolean;
  hasDetection?: boolean;
  hasReport?: boolean;
  notes?: string;
  onAddNote?: (note: string) => void;
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({
  currentStepIndex = 3,
  discoveryDate,
  capturedDate,
  hasHash = true,
  hasDetection = true,
  hasReport = false,
  notes = '',
  onAddNote
}) => {
  const steps: TimelineStep[] = [
    {
      id: 'step_discovered',
      title: 'Content Discovered',
      subtitle: discoveryDate ? `Discovered: ${new Date(discoveryDate).toLocaleDateString()}` : 'Recorded discovery timestamp',
      completed: true,
      completedAt: discoveryDate,
      icon: <Clock className="w-4 h-4 text-teal-400" />
    },
    {
      id: 'step_documented',
      title: 'Media Documented',
      subtitle: capturedDate ? `Captured: ${new Date(capturedDate).toLocaleDateString()}` : 'Preserved original file without modifications',
      completed: true,
      completedAt: capturedDate,
      icon: <FileCheck className="w-4 h-4 text-teal-400" />
    },
    {
      id: 'step_hash',
      title: 'Hash Generated',
      subtitle: 'SHA-256 file integrity hash computed on-device',
      completed: hasHash,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'step_detection',
      title: 'Detection Performed',
      subtitle: 'DeepDetect likelihood screening & ShieldScan perceptual check completed',
      completed: hasDetection,
      icon: <Cpu className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'step_package',
      title: 'Evidence Package Generated',
      subtitle: 'Structured evidence record compiled locally',
      completed: hasReport,
      icon: <FileText className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'step_complaint',
      title: 'Complaint Prepared',
      subtitle: 'Cyber cell complaint checklist reviewed & draft ready',
      completed: false,
      icon: <CheckSquare className="w-4 h-4 text-purple-400" />
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Incident Evidence Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Chronological record of discovery, documentation, and hashing.</p>
        </div>
      </div>

      {/* Vertical Step Sequence */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Step Node Icon */}
            <div
              className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full border flex items-center justify-center transition ${
                step.completed
                  ? 'bg-slate-950 border-teal-500/60 text-teal-400 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              {step.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step.icon}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-slate-400'}`}>
                  {step.title}
                </span>
                {step.completedAt && (
                  <span className="text-[10px] text-slate-500">
                    ({new Date(step.completedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{step.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
