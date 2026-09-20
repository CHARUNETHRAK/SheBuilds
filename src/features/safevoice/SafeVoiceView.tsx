import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake, Send, Globe, Trash2, Save, ShieldCheck, AlertCircle, PhoneCall, Info, Lock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { safeVoiceService } from './SafeVoiceService';
import { shieldDB } from '../../storage/db';
import { SafeVoiceMessage, Language, Case, RiskCategory } from '../../types';

export const SafeVoiceView: React.FC = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [messages, setMessages] = useState<SafeVoiceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [urgentRisk, setUrgentRisk] = useState<RiskCategory | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCases();
    syncSessionMessages();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadCases = async () => {
    const list = await shieldDB.getAllCases();
    setCases(list);
    if (list.length > 0) setSelectedCaseId(list[0].id);
  };

  const syncSessionMessages = () => {
    const msgs = safeVoiceService.getSessionMessages();
    if (msgs.length === 0) {
      // Welcome message
      const welcomeMsg: SafeVoiceMessage = {
        id: 'msg_welcome',
        sender: 'assistant',
        text: 'Hello. I am SafeVoice, your confidential digital safety guide.\n\nWhatever you are going through, you are safe here. We take things one clear step at a time.\n\nHow can I help support you today?',
        timestamp: new Date().toISOString(),
        language,
        suggestedActions: [
          'What should I do first?',
          'How can I document this?',
          'How can I report this?',
          'I need someone to talk to'
        ]
      };
      setMessages([welcomeMsg]);
    } else {
      setMessages(msgs);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || loading) return;

    setInputText('');
    setLoading(true);
    setSaveSuccess(false);

    const response = await safeVoiceService.sendMessage(prompt, { selectedLanguage: language });
    setMessages(safeVoiceService.getSessionMessages());

    if (response.riskCategory !== 'NORMAL_SUPPORT') {
      setUrgentRisk(response.riskCategory);
    } else {
      setUrgentRisk(null);
    }

    setLoading(false);
  };

  const handleClearSession = () => {
    safeVoiceService.clearSession();
    setUrgentRisk(null);
    setSaveSuccess(false);
    syncSessionMessages();
  };

  const handleSaveToCase = async () => {
    if (!selectedCaseId) return;
    await safeVoiceService.saveSessionToCase(selectedCaseId);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Boundary Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.safevoice} - Support Guide</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Trauma-informed, confidential decision support & next-step guidance.
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <Globe className="w-4 h-4 text-teal-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-2 focus:outline-none"
          >
            {availableLanguages.map(l => (
              <option key={l.code} value={l.code}>{l.nativeName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Boundary & Scope Disclaimer Banner */}
      <div className="p-3.5 bg-slate-950/80 border border-teal-500/30 rounded-xl flex items-center space-x-3 text-xs text-teal-300 shadow">
        <Info className="w-4 h-4 shrink-0 text-emerald-400" />
        <span className="font-medium">
          Information & Guidance Only — SafeVoice is not a therapist, lawyer, police officer, or emergency service.
        </span>
      </div>

      {/* Urgent Safety Helpline Panel (Shown if risk detected) */}
      {urgentRisk && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl space-y-2 text-xs text-amber-200 shadow-xl">
          <div className="flex items-center space-x-2 font-bold text-amber-300">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span>Urgent Crisis & Emergency Helplines</span>
          </div>
          <p className="leading-relaxed">
            If you are in immediate danger or severe distress, please connect with official emergency services:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-semibold text-slate-100">
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">112 - Emergency Response</div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">1930 - Cyber Crime Line</div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">+91 9999 666 555 - Vandrevala</div>
          </div>
        </div>
      )}

      {/* Chat Bubble Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                
                <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-slate-800/50">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sender === 'assistant' && (
                    <span className="text-teal-400 font-medium">SafeVoice Guide</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 text-slate-400 p-3 rounded-2xl border border-slate-800 text-xs flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Generating trauma-informed guidance...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Suggestion Pills */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Suggested Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'What should I do first?',
              'How can I document this?',
              'How can I report this?',
              'I need someone to talk to',
              'Show my case options'
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="text-xs bg-slate-950 hover:bg-slate-800 text-teal-300 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-teal-500/50 transition"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input Composer & Controls */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask SafeVoice anything privately..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || loading}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white p-3 rounded-xl shadow transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Session Privacy Controls & Case Save */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-2 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session-only memory. Nothing saved unless added to case.</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleClearSession}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>

              {cases.length > 0 && (
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="bg-slate-950 text-[11px] text-slate-200 border border-slate-800 rounded-lg p-1.5 focus:outline-none"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveToCase}
                    className="flex items-center space-x-1 text-teal-300 hover:text-white bg-slate-950 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition"
                  >
                    {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saveSuccess ? 'Saved!' : 'Save to Case'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
