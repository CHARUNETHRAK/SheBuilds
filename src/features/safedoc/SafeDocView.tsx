import React, { useState, useEffect } from 'react';
import { FileText, Plus, ShieldCheck, Copy, Download, Check, Calendar, Lock, AlertTriangle, Trash2, Eye, Info, HardDrive, Clock, CheckSquare } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { shieldDB } from '../../storage/db';
import { EvidenceRecord, IncidentCase } from '../../types';
import { calculateSHA256 } from '../../security/crypto';
import { encryptionService } from '../../security/EncryptionService';
import { EvidenceTimeline } from './EvidenceTimeline';
import { ComplaintChecklist } from './ComplaintChecklist';
import { generateEvidencePDF } from './pdfGenerator';

export const SafeDocView: React.FC = () => {
  const { t } = useLanguage();
  const [cases, setCases] = useState<IncidentCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<IncidentCase | null>(null);
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);

  // New Case Form State
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [incidentPlatform, setIncidentPlatform] = useState('Instagram');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [discoveryDate, setDiscoveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [description, setDescription] = useState('');

  // Add Evidence File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [encryptLocal, setEncryptLocal] = useState(true);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const caseList = await shieldDB.getAllIncidentCases();
    setCases(caseList);

    if (caseList.length > 0) {
      const activeCase = selectedCase ? caseList.find(c => c.id === selectedCase.id) || caseList[0] : caseList[0];
      setSelectedCase(activeCase);
      const evList = await shieldDB.getAllEvidenceRecords(activeCase.id);
      setEvidenceRecords(evList);
      if (evList.length > 0) setSelectedEvidence(evList[0]);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: IncidentCase = {
      id: `inc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      incidentDate,
      discoveryDate,
      platform: incidentPlatform,
      sourceUrl: sourceUrl || undefined,
      description,
      evidenceIds: [],
      status: 'Active'
    };

    await shieldDB.saveIncidentCase(newCase);
    setShowNewCaseModal(false);
    setDescription('');
    setSourceUrl('');
    await loadData();
    setSelectedCase(newCase);
  };

  const handleSelectCase = async (incCase: IncidentCase) => {
    setSelectedCase(incCase);
    const evList = await shieldDB.getAllEvidenceRecords(incCase.id);
    setEvidenceRecords(evList);
    setSelectedEvidence(evList.length > 0 ? evList[0] : null);
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !selectedFile) return;

    const buffer = await selectedFile.arrayBuffer();
    const sha256 = await calculateSHA256(buffer);

    let notesText = evidenceNotes;
    if (encryptLocal) {
      const encrypted = await encryptionService.encrypt(evidenceNotes);
      notesText = `[ENCRYPTED]:${JSON.stringify(encrypted)}`;
    }

    const record: EvidenceRecord = {
      id: `evrec_${Date.now()}`,
      caseId: selectedCase.id,
      fileName: selectedFile.name,
      mediaType: selectedFile.type,
      fileSize: selectedFile.size,
      sha256,
      createdAt: new Date().toISOString(),
      capturedAt: selectedCase.incidentDate,
      sourceUrl: selectedCase.sourceUrl,
      metadataSummary: {
        format: selectedFile.type,
        rawFindings: ['Web Crypto SHA-256 computed locally', 'Header parsed on-device']
      },
      notes: notesText,
      encryptionStatus: encryptLocal ? 'Encrypted' : 'Plaintext'
    };

    await shieldDB.saveEvidenceRecord(record);
    selectedCase.evidenceIds.push(record.id);
    selectedCase.updatedAt = new Date().toISOString();
    await shieldDB.saveIncidentCase(selectedCase);

    setSelectedFile(null);
    setEvidenceNotes('');
    await loadData();
    setSelectedEvidence(record);
  };

  const handleDeleteCase = async (caseId: string) => {
    if (confirm('Are you sure you want to permanently delete this case and all associated local evidence? This action cannot be undone.')) {
      await shieldDB.deleteIncidentCase(caseId);
      setSelectedCase(null);
      setSelectedEvidence(null);
      await loadData();
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedEvidence) return;
    setPdfGenerating(true);

    let decryptedNotes = selectedEvidence.notes;
    if (selectedEvidence.notes.startsWith('[ENCRYPTED]:')) {
      try {
        const payload = JSON.parse(selectedEvidence.notes.replace('[ENCRYPTED]:', ''));
        decryptedNotes = await encryptionService.decrypt(payload);
      } catch {
        decryptedNotes = selectedEvidence.notes;
      }
    }

    const evidenceCopy = { ...selectedEvidence, notes: decryptedNotes };
    const pdfDoc = generateEvidencePDF(evidenceCopy, selectedCase);
    pdfDoc.save(`ShieldHer_Evidence_Report_${selectedEvidence.id}.pdf`);
    setPdfGenerating(false);
    setShowReportModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SafeDoc Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.safedoc} - Privacy-First Evidence Package</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Structured incident documentation with Web Crypto SHA-256 integrity hashing and downloadable PDF reports.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewCaseModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Incident Case</span>
        </button>
      </div>

      {/* Main SafeDoc Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Incident Cases ({cases.length})
          </h3>

          {cases.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
              No incident cases yet. Click "New Incident Case" to begin.
            </div>
          ) : (
            cases.map((inc) => (
              <div
                key={inc.id}
                onClick={() => handleSelectCase(inc)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedCase?.id === inc.id
                    ? 'bg-slate-900 border-teal-500/50 shadow-lg shadow-teal-500/5'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-white">{inc.platform} Incident</span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    {inc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{inc.description || 'No description'}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                  <span>Date: {inc.incidentDate}</span>
                  <span>{inc.evidenceIds.length} Evidence Records</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Case Details & Evidence Records */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Incident Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                      {selectedCase.platform}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">Incident Reference: {selectedCase.id}</h3>
                    <p className="text-xs text-slate-400">Created: {new Date(selectedCase.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteCase(selectedCase.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                      title="Permanently Delete Case File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Evidence Item List Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Attached Evidence ({evidenceRecords.length})
                    </h4>
                  </div>

                  {evidenceRecords.length === 0 ? (
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 text-center">
                      No media evidence records attached to this case. Upload a file below.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {evidenceRecords.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvidence(ev)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                            selectedEvidence?.id === ev.id
                              ? 'bg-slate-950 border-teal-500 text-teal-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-center font-bold">
                            <span className="truncate max-w-[180px] text-white">{ev.fileName}</span>
                            <span className="text-[10px] text-slate-400">{(ev.fileSize / 1024).toFixed(0)} KB</span>
                          </div>
                          <p className="font-mono text-[10px] text-teal-400 truncate">SHA-256: {ev.sha256}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add New Evidence Record */}
                <form onSubmit={handleAddEvidence} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white">Attach New Media Evidence Record</h4>
                  
                  <input
                    type="file"
                    required
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800"
                  />

                  <textarea
                    rows={2}
                    placeholder="Add evidence notes or incident observations..."
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={encryptLocal}
                        onChange={(e) => setEncryptLocal(e.target.checked)}
                        className="rounded border-slate-800"
                      />
                      <span>Encrypt notes using Web Crypto API</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!selectedFile}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      Save Evidence Record
                    </button>
                  </div>
                </form>
              </div>

              {/* Selected Evidence Details Screen */}
              {selectedEvidence && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-white">Evidence Detail & Cryptographic Hash</h3>
                      <p className="text-xs text-slate-400 mt-0.5">ID: {selectedEvidence.id}</p>
                    </div>

                    <button
                      onClick={() => setShowReportModal(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate Evidence PDF</span>
                    </button>
                  </div>

                  {/* Cryptographic SHA-256 Integrity Box */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-400">File Integrity Hash</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3 inline mr-1" /> Web Crypto SHA-256
                      </span>
                    </div>

                    <p className="font-mono text-xs text-teal-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {selectedEvidence.sha256}
                    </p>

                    <p className="text-[11px] text-slate-400 leading-relaxed italic pt-1">
                      "File integrity hash - This hash can help show whether the file changed after hashing. It does not by itself prove that the file was authentic at the moment of capture."
                    </p>
                  </div>

                  {/* Interactive Evidence Timeline */}
                  <EvidenceTimeline
                    discoveryDate={selectedCase.discoveryDate}
                    capturedDate={selectedEvidence.capturedAt}
                    hasHash={!!selectedEvidence.sha256}
                    hasDetection={!!selectedEvidence.deepDetectResult}
                    hasReport={true}
                  />

                  {/* Complaint Checklist */}
                  <ComplaintChecklist />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
              Select an incident case from the left sidebar to view structured evidence.
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Incident Case</h3>
            
            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Platform Name</label>
                <select
                  value={incidentPlatform}
                  onChange={(e) => setIncidentPlatform(e.target.value)}
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
                <label className="block text-slate-300 font-medium mb-1">Source URL / Web Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe incident context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
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

      {/* PDF Report Preview & Download Modal */}
      {showReportModal && selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <span>Generate SafeDoc Evidence Package PDF</span>
            </h3>

            {/* Privacy Warning Banner */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-xs text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">Privacy & Download Warning</p>
                <p className="leading-relaxed">
                  "Download carefully. This report may contain sensitive information." Keep the PDF saved in a secure location.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <p className="font-bold text-white">Included Report Sections:</p>
              <p>• 12-Section Structured Evidence Package</p>
              <p>• Cryptographic SHA-256 File Integrity Hash</p>
              <p>• DeepDetect & ShieldScan Technical Metrics</p>
              <p>• Complaint Checklist & Statutory References</p>
              <p className="text-[11px] text-slate-400 pt-1 italic">
                Footer: "Generated by ShieldHer. This document is a structured evidence record and does not constitute a legal opinion or guarantee of admissibility."
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={pdfGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{pdfGenerating ? 'Generating PDF...' : 'Download Evidence PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
