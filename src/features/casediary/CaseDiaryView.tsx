import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Calendar, Clock, CheckSquare, Square, AlertCircle, CheckCircle2, ChevronRight, Filter, Info, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { shieldDB } from '../../storage/db';
import { IncidentCase, CaseStatus, FollowUp, TimelineEvent } from '../../types';
import { followUpScheduler } from './FollowUpScheduler';

export const CaseDiaryView: React.FC = () => {
  const { t } = useLanguage();
  const [cases, setCases] = useState<IncidentCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<IncidentCase | null>(null);

  // New Case Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [platform, setPlatform] = useState('Instagram');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [discoveryDate, setDiscoveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // Timeline Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Follow Up Reschedule State
  const [rescheduleDate, setRescheduleDate] = useState('');

  const statuses: CaseStatus[] = [
    'New',
    'Documented',
    'Report Prepared',
    'Reported',
    'Follow-up Needed',
    'Resolved',
    'Closed'
  ];

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const list = await shieldDB.getAllIncidentCases();
    setCases(list);
    if (list.length > 0) {
      setSelectedCase(selectedCase ? list.find(c => c.id === selectedCase.id) || list[0] : list[0]);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const caseId = `inc_${Date.now()}`;
    const createdAt = new Date().toISOString();

    // Auto-generate Day 14 & Day 30 follow-up reminders
    const initialFollowUps = followUpScheduler.generateInitialFollowUps(caseId, createdAt);

    const newTimelineEvents: TimelineEvent[] = [
      {
        id: `evt_disc_${Date.now()}`,
        caseId,
        timestamp: discoveryDate,
        title: 'Incident Discovered',
        description: `Discovered content on ${platform}`,
        type: 'Incident discovered'
      },
      {
        id: `evt_doc_${Date.now()}`,
        caseId,
        timestamp: createdAt,
        title: 'Case File Created',
        description: 'Initialized SafeDoc incident case file',
        type: 'Case status change'
      }
    ];

    const newCase: IncidentCase = {
      id: caseId,
      createdAt,
      updatedAt: createdAt,
      incidentDate,
      discoveryDate,
      platform,
      description,
      evidenceIds: [],
      status: 'New',
      followUps: initialFollowUps,
      timelineEvents: newTimelineEvents
    };

    await shieldDB.saveIncidentCase(newCase);
    setShowNewModal(false);
    setDescription('');
    await loadCases();
    setSelectedCase(newCase);
  };

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!selectedCase) return;

    const statusEvent: TimelineEvent = {
      id: `evt_status_${Date.now()}`,
      caseId: selectedCase.id,
      timestamp: new Date().toISOString(),
      title: `Status Changed to ${newStatus}`,
      description: `User updated case status to ${newStatus}`,
      type: 'Case status change'
    };

    const updatedCase: IncidentCase = {
      ...selectedCase,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      timelineEvents: [...(selectedCase.timelineEvents || []), statusEvent]
    };

    await shieldDB.saveIncidentCase(updatedCase);
    setSelectedCase(updatedCase);
    await loadCases();
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !eventTitle) return;

    const newEvent: TimelineEvent = {
      id: `evt_user_${Date.now()}`,
      caseId: selectedCase.id,
      timestamp: new Date().toISOString(),
      title: eventTitle,
      description: eventDescription,
      type: 'User-added event'
    };

    const updatedCase: IncidentCase = {
      ...selectedCase,
      updatedAt: new Date().toISOString(),
      timelineEvents: [...(selectedCase.timelineEvents || []), newEvent]
    };

    await shieldDB.saveIncidentCase(updatedCase);
    setSelectedCase(updatedCase);
    setShowEventModal(false);
    setEventTitle('');
    setEventDescription('');
    await loadCases();
  };

  const handleCompleteFollowUp = async (fu: FollowUp) => {
    if (!selectedCase) return;
    const completedFu = followUpScheduler.markComplete(fu);
    const updatedFollowUps = (selectedCase.followUps || []).map(f => f.id === fu.id ? completedFu : f);

    const updatedCase = { ...selectedCase, followUps: updatedFollowUps, updatedAt: new Date().toISOString() };
    await shieldDB.saveIncidentCase(updatedCase);
    setSelectedCase(updatedCase);
    await loadCases();
  };

  const handleRescheduleFollowUp = async (fu: FollowUp, newDate: string) => {
    if (!selectedCase || !newDate) return;
    const rescheduledFu = followUpScheduler.reschedule(fu, newDate);
    const updatedFollowUps = (selectedCase.followUps || []).map(f => f.id === fu.id ? rescheduledFu : f);

    const updatedCase = { ...selectedCase, followUps: updatedFollowUps, updatedAt: new Date().toISOString() };
    await shieldDB.saveIncidentCase(updatedCase);
    setSelectedCase(updatedCase);
    await loadCases();
  };

  const handleDeleteCase = async (caseId: string) => {
    if (confirm('Permanently delete this case file and all local diary logs?')) {
      await shieldDB.deleteIncidentCase(caseId);
      setSelectedCase(null);
      await loadCases();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.casediary} - Post-Reporting Tracker</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Private timeline events, Day 14/30 reminders, and user-controlled case status.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Case File</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Case Selection Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Tracked Incident Files ({cases.length})
          </h3>

          {cases.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
              No cases tracked yet. Click "New Case File" to begin.
            </div>
          ) : (
            cases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedCase?.id === c.id
                    ? 'bg-slate-900 border-teal-500/50 shadow-lg shadow-teal-500/5'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-white">{c.platform} Incident</span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>Incident: {c.incidentDate}</span>
                  <span>{c.evidenceIds?.length || 0} Evidence Files</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Case Details & Timeline */}
        <div className="lg:col-span-8">
          {selectedCase ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Case Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                      ID: {selectedCase.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedCase.platform} Case File</h3>
                  <p className="text-xs text-slate-400">Created: {new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Change Selector */}
                  <div className="flex items-center space-x-1.5">
                    <label className="text-xs text-slate-400 shrink-0">Status:</label>
                    <select
                      value={selectedCase.status}
                      onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                      className="bg-slate-950 text-xs font-semibold text-teal-300 border border-slate-800 rounded-xl p-2 focus:outline-none"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleDeleteCase(selectedCase.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Delete Case File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Resolved Non-Legal Disclaimer */}
              {selectedCase.status === 'Resolved' && (
                <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs text-teal-300 flex items-center space-x-2">
                  <Info className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>"Resolved means marked complete by user, not legal resolution."</span>
                </div>
              )}

              {/* Day 14 & Day 30 Follow-Up Reminders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Follow-up Reminders (Day 14 / Day 30)
                  </h4>
                  <span className="text-[10px] text-teal-400 italic">Discreet Notification Mode</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCase.followUps?.map((fu) => (
                    <div
                      key={fu.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        fu.completed
                          ? 'bg-slate-950 border-slate-800 text-slate-500'
                          : 'bg-slate-950 border-teal-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="capitalize">{fu.type === 'day14' ? 'Day 14 Follow-Up' : fu.type === 'day30' ? 'Day 30 Review' : 'Custom Follow-Up'}</span>
                        <span className="text-[10px] text-teal-400 font-mono">{fu.scheduledDate}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">{fu.notes}</p>

                      <div className="flex items-center justify-between pt-1">
                        {!fu.completed ? (
                          <button
                            onClick={() => handleCompleteFollowUp(fu)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Mark Complete</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Event Timeline */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chronological Event Log</h4>
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="text-xs text-teal-300 hover:text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Log Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedCase.timelineEvents?.map((evt) => (
                    <div key={evt.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between items-center font-semibold text-white">
                        <span>{evt.title}</span>
                        <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
              Select a case file to view diary timeline and follow-ups.
            </div>
          )}
        </div>
      </div>

      {/* New Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Add User Timeline Event</h3>
            
            <form onSubmit={handleAddTimelineEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Contacted Platform Support"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe details of action taken..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Case File</h3>
            
            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Platform Name</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Date</label>
                  <input
                    type="date"
                    required
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Discovery Date</label>
                  <input
                    type="date"
                    required
                    value={discoveryDate}
                    onChange={(e) => setDiscoveryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
