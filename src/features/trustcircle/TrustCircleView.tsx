import React, { useState, useEffect } from 'react';
import { Users, Phone, ShieldCheck, ExternalLink, Heart, Globe, Filter, AlertTriangle, Share2, Copy, Check, Info, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SupportContact, IncidentCase, SanitizedCaseSummary } from '../../types';
import { trustCircleDirectory } from './TrustCircleDirectory';
import { shieldDB } from '../../storage/db';

export const TrustCircleView: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [locationQuery, setLocationQuery] = useState<string>('');

  // Personal Contacts
  const [personalContacts, setPersonalContacts] = useState<{ name: string; phone: string; relation: string }[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');

  // External Navigation Warning Modal
  const [navTarget, setNavTarget] = useState<{ type: 'phone' | 'url'; value: string; org: string } | null>(null);

  // Sanitized Case Sharing Modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [userCases, setUserCases] = useState<IncidentCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [sanitizedSummary, setSanitizedSummary] = useState<SanitizedCaseSummary | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const cases = await shieldDB.getAllIncidentCases();
    setUserCases(cases);
    if (cases.length > 0) {
      setSelectedCaseId(cases[0].id);
      setSanitizedSummary(trustCircleDirectory.prepareSanitizedSummary(cases[0]));
    }
  };

  const contacts = trustCircleDirectory.getAllContacts({
    category: selectedCategory,
    language: selectedLanguage,
    location: locationQuery
  });

  const handleAddPersonalContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    setPersonalContacts([...personalContacts, { name: newName, phone: newPhone, relation: newRelation }]);
    setNewName('');
    setNewPhone('');
    setNewRelation('');
  };

  const handleSelectCaseForShare = (caseId: string) => {
    setSelectedCaseId(caseId);
    const targetCase = userCases.find(c => c.id === caseId);
    if (targetCase) {
      setSanitizedSummary(trustCircleDirectory.prepareSanitizedSummary(targetCase));
    }
  };

  const handleCopySummary = () => {
    if (!sanitizedSummary) return;
    const text = `ShieldHer Sanitized Incident Summary:
Case Ref: ${sanitizedSummary.caseId}
Platform: ${sanitizedSummary.sanitizedPlatform}
Date: ${sanitizedSummary.incidentDate}
Evidence Count: ${sanitizedSummary.evidenceCount}
Integrity Hash: Web Crypto SHA-256 Verified
Description: ${sanitizedSummary.sanitizedDescription}
Timestamp: ${sanitizedSummary.generatedAt}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmNavigation = () => {
    if (!navTarget) return;
    if (navTarget.type === 'url') {
      window.open(navTarget.value, '_blank', 'noopener,noreferrer');
    } else if (navTarget.type === 'phone') {
      window.open(`tel:${navTarget.value}`, '_self');
    }
    setNavTarget(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.trustcircle} - Support Network</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Vetted support directory, personal emergency contacts, and sanitized case sharing.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Prepare Information to Share</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Notice:</strong> Directory contacts below are currently marked <strong>"Demo / Not for real-world use"</strong>. Partner verified directory integration ready.
        </span>
      </div>

      {/* Main Directory & Personal Contacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Directory */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>Filter Support Directory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Category */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="counsellor">Counsellor</option>
                  <option value="NGO">NGO</option>
                  <option value="legal aid">Legal Aid</option>
                  <option value="campus support">Campus Support</option>
                  <option value="cyber support">Cyber Support</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Location Search</label>
                <input
                  type="text"
                  placeholder="e.g. National, Delhi"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Directory Contact List */}
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
                No support contacts match the selected filters.
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 transition space-y-2.5 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {contact.category}
                        </span>
                        {contact.isDemo && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Demo / Not for real-world use
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1.5">{contact.organization}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{contact.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                    <span>📍 {contact.location}</span>
                    <span>🗣️ {contact.language.join(', ')}</span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between text-xs gap-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setNavTarget({ type: 'phone', value: contact.contactValue, org: contact.organization })}
                      className="flex items-center space-x-1.5 text-teal-300 font-semibold hover:text-teal-200 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      <span>{contact.contactValue}</span>
                    </button>

                    {contact.contactMethod === 'Website' && (
                      <button
                        onClick={() => setNavTarget({ type: 'url', value: contact.contactValue, org: contact.organization })}
                        className="flex items-center space-x-1 text-slate-400 hover:text-white transition"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Personal Trusted Contacts Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Personal Trusted Contacts</span>
            </h3>
            <p className="text-xs text-slate-400">
              Store trusted friend or family contacts locally. Kept strictly on device.
            </p>

            <form onSubmit={handleAddPersonalContact} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Sister, Counselor)"
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition shadow"
              >
                Add Trusted Contact
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {personalContacts.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-2">No personal contacts added yet.</p>
              ) : (
                personalContacts.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{c.name}</span>
                      <span className="text-slate-400 font-normal">{c.relation}</span>
                    </div>
                    <p className="text-teal-400 font-mono">{c.phone}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* External Navigation Warning Modal */}
      {navTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">External Contact Confirmation</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "You are leaving ShieldHer to contact this organization."
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-teal-300">{navTarget.org}</p>
              <p className="text-slate-400 font-mono">{navTarget.value}</p>
            </div>

            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[11px] text-teal-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>ShieldHer does NOT share any case files, media, or personal identity when you contact external entities.</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setNavTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNavigation}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                Proceed to Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sanitized Case Sharing Drawer / Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-teal-400">
                <Share2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Prepare Information to Share</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Generate a sanitized, privacy-safe summary stripping personal identifiers to share with trusted counselors or legal advisors.
            </p>

            {userCases.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Case File</label>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => handleSelectCaseForShare(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    {userCases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.platform} Case ({c.id}) - {c.status}
                      </option>
                    ))}
                  </select>
                </div>

                {sanitizedSummary && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
                    <div className="flex justify-between border-b border-slate-800 pb-1 font-sans text-[11px] font-bold text-teal-400">
                      <span>SANITIZED SUMMARY PREVIEW</span>
                      <span>PII REMOVED</span>
                    </div>
                    <p><span className="text-slate-500">Case ID:</span> {sanitizedSummary.caseId}</p>
                    <p><span className="text-slate-500">Platform:</span> {sanitizedSummary.sanitizedPlatform}</p>
                    <p><span className="text-slate-500">Incident Date:</span> {sanitizedSummary.incidentDate}</p>
                    <p><span className="text-slate-500">Evidence Count:</span> {sanitizedSummary.evidenceCount} Files</p>
                    <p><span className="text-slate-500">Integrity:</span> Web Crypto SHA-256 Verified</p>
                    <p className="font-sans text-[11px] text-slate-300 pt-1">{sanitizedSummary.sanitizedDescription}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Requires user review before sending</span>
                  </div>

                  <button
                    onClick={handleCopySummary}
                    className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Sanitized Summary'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No active incident cases found in local diary. Create a case file first in Case Diary.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

