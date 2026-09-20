import React from 'react';
import { ShieldCheck, Info, AlertCircle, Scale, Eye, FileText, HeartHandshake, Cpu, Lock } from 'lucide-react';

export const ResponsibleAIView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-3">
        <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Responsible AI & System Transparency</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ethical AI principles, probabilistic screening limitations, fairness evaluation framework, and safety disclosures.
          </p>
        </div>
      </div>

      {/* AI Confidence & Terminology Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AI Confidence & Non-Definitive Language Standard</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          ShieldHer strictly enforces non-definitive AI language to prevent false certainty, victim blaming, or premature legal conclusions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 space-y-2">
            <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider">Forbidden Absolute Claims</span>
            <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
              <li className="line-through">✖ "100% fake"</li>
              <li className="line-through">✖ "100% real"</li>
              <li className="line-through">✖ "Confirmed abuser"</li>
              <li className="line-through">✖ "Confirmed victim"</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Required Probabilistic Terminology</span>
            <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
              <li>✓ "Screening indicates..."</li>
              <li>✓ "Possible indicators..."</li>
              <li>✓ "Potential match..."</li>
              <li>✓ "Further verification may be required."</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Module-by-Module Technical Disclosures */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Technical Disclosures by Module
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DeepDetect */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>DeepDetect Screening Model</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>DeepDetect provides <strong>probabilistic screening</strong> likelihood, not legal proof.</li>
              <li>Screening may yield false positive or false negative findings.</li>
              <li>Performance can vary based on skin tone, age group, lighting, and heavy compression.</li>
              <li>Calculates on-device metadata anomalies and facial edge texture consistency.</li>
            </ul>
          </div>

          {/* SafeVoice */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>SafeVoice AI Guidance</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>SafeVoice provides <strong>decision-support guidance only</strong>.</li>
              <li>SafeVoice is NOT a licensed therapist, legal advocate, or emergency response line.</li>
              <li>Immediate crisis situations trigger local helpline recommendations (112 / 1930).</li>
              <li>Human oversight is required for institutional pilot deployments.</li>
            </ul>
          </div>

          {/* ShieldScan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <span>ShieldScan Hash Indexing</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>Perceptual hash matching (pHash/dHash) matches against known protected list entries.</li>
              <li>Absence of a hash match does <strong>NOT</strong> mean content is safe or authentic.</li>
              <li>Hashes are matched strictly on-device using client-side Web Crypto algorithms.</li>
            </ul>
          </div>

          {/* SafeDoc */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <FileText className="w-4 h-4" />
              <span>SafeDoc Evidence Packaging</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>Web Crypto SHA-256 verifies record integrity <strong>after hashing</strong>.</li>
              <li>SHA-256 hashing does NOT independently verify capture authenticity at original source.</li>
              <li>Formal court admissibility requires statutory law enforcement procedures.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fairness Testing Framework & Benchmark Evaluation Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Fairness & Bias Evaluation Framework</span>
          </h3>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Evaluation pending
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ShieldHer incorporates a standardized evaluation framework to benchmark model performance across diverse demographic and technical dimensions:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Skin Tone</p>
            <p className="text-amber-400 font-semibold text-[11px]">Evaluation pending</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Age Group</p>
            <p className="text-amber-400 font-semibold text-[11px]">Evaluation pending</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Image Quality</p>
            <p className="text-amber-400 font-semibold text-[11px]">Evaluation pending</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Compression</p>
            <p className="text-amber-400 font-semibold text-[11px]">Evaluation pending</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Language QA</p>
            <p className="text-emerald-400 font-semibold text-[11px]">EN / TA / HI Verified</p>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          <strong>Fairness Disclaimer:</strong> No formal demographic benchmark dataset is currently attached to this repository. All performance metrics represent local prototype screening tests.
        </div>
      </div>
    </div>
  );
};
