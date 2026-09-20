import React, { useState, useEffect } from 'react';
import { Cpu, FileText, HeartHandshake, BookOpen, Users, ShieldCheck, HardDrive, Bell, Calendar, ChevronRight, Lock, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { shieldDB } from '../storage/db';
import { IncidentCase, FollowUp, TimelineEvent } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [activeCases, setActiveCases] = useState<IncidentCase[]>([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState<FollowUp[]>([]);
  const [recentEvents, setRecentEvents] = useState<TimelineEvent[]>([]);
  const [storageUsageMB, setStorageUsageMB] = useState('0.4 MB');

  useEffect(() => {
    async function loadDashboardData() {
      const incidentCases = await shieldDB.getAllIncidentCases();
      setActiveCases(incidentCases);

      const allFollowUps: FollowUp[] = [];
      const allEvents: TimelineEvent[] = [];

      incidentCases.forEach(c => {
        if (c.followUps) {
          c.followUps.forEach(f => {
            if (!f.completed) allFollowUps.push(f);
          });
        }
        if (c.timelineEvents) {
          allEvents.push(...c.timelineEvents);
        }
      });

      // Sort events newest first
      allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setUpcomingFollowUps(allFollowUps.slice(0, 4));
      setRecentEvents(allEvents.slice(0, 4));
    }
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. QUICK ACTIONS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>Quick Actions</span>
          </h2>
          <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            On-Device Confidential Mode
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('deepdetect')}
            className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/40 rounded-xl transition text-left space-y-2 group shadow-md"
          >
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg w-fit border border-teal-500/20 group-hover:scale-105 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-white group-hover:text-teal-400 transition">Check Media</p>
            <p className="text-[10px] text-slate-400">Screen manipulation</p>
          </button>

          <button
            onClick={() => onNavigate('safedoc')}
            className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition text-left space-y-2 group shadow-md"
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit border border-emerald-500/20 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-white group-hover:text-emerald-400 transition">Document Evidence</p>
            <p className="text-[10px] text-slate-400">SHA-256 PDF report</p>
          </button>

          <button
            onClick={() => onNavigate('safevoice')}
            className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 rounded-xl transition text-left space-y-2 group shadow-md"
          >
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg w-fit border border-blue-500/20 group-hover:scale-105 transition">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-white group-hover:text-blue-400 transition">Talk to SafeVoice</p>
            <p className="text-[10px] text-slate-400">Trauma-informed guidance</p>
          </button>

          <button
            onClick={() => onNavigate('casediary')}
            className="p-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-xl transition text-left space-y-2 group shadow-md"
          >
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-fit border border-amber-500/20 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs text-white group-hover:text-amber-400 transition">View Case Diary</p>
            <p className="text-[10px] text-slate-400">Track status & reminders</p>
          </button>
        </div>
      </div>

      {/* STATUS & OVERVIEW BAR (2. ACTIVE CASES & 4. PRIVACY STATUS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Privacy Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-3.5 shadow-lg">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.privacyStatusTitle}</p>
            <p className="text-xs font-semibold text-teal-300 mt-0.5">{t.privacyStatusActive} (Zero Upload)</p>
          </div>
        </div>

        {/* Active Cases Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Incident Cases</p>
              <p className="text-lg font-bold text-white mt-0.5">{activeCases.length} Managed Files</p>
            </div>
          </div>
          <button onClick={() => onNavigate('casediary')} className="text-slate-400 hover:text-white p-1">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 5. TrustCircle Quick Access */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TrustCircle Network</p>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">Vetted Helplines & Legal Aid</p>
            </div>
          </div>
          <button onClick={() => onNavigate('trustcircle')} className="text-rose-400 hover:text-rose-300 font-semibold text-xs flex items-center">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 3. UPCOMING FOLLOW-UP & 6. RECENT ACTIVITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Upcoming Follow-ups Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Follow-up Actions</span>
            </h3>
            <span className="text-[10px] text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              Discreet Wording Mode
            </span>
          </div>

          {upcomingFollowUps.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4">No pending follow-ups scheduled.</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingFollowUps.map(fu => (
                <div key={fu.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center font-semibold text-slate-200">
                    <span className="capitalize">{fu.type === 'day14' ? 'Day 14 Follow-Up' : fu.type === 'day30' ? 'Day 30 Review' : 'Custom Follow-Up'}</span>
                    <span className="text-[10px] text-amber-400 font-mono">Due: {fu.scheduledDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{fu.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Recent Case Activity Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Recent Diary Activity Log</span>
            </h3>
            <button
              onClick={() => onNavigate('casediary')}
              className="text-xs text-teal-400 hover:text-white transition"
            >
              View All
            </button>
          </div>

          {recentEvents.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4">No recent diary activity logged.</p>
          ) : (
            <div className="space-y-2.5">
              {recentEvents.map(evt => (
                <div key={evt.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{evt.title}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


