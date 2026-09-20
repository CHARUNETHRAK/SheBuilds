/**
 * SafeVoice Service Module
 * 
 * Manages client-side SafeVoice session state, prompt risk classification,
 * and communication with the FastAPI backend proxy (`POST /api/safevoice/chat`).
 */

import { SafeVoiceMessage, SafeVoiceContext, SafeVoiceResponse, Language, RiskCategory } from '../../types';
import { riskClassifier } from './RiskClassifier';
import { shieldDB } from '../../storage/db';

const API_ENDPOINT = '/api/safevoice/chat';

export class SafeVoiceService {
  private sessionMessages: SafeVoiceMessage[] = [];
  private activeLanguage: Language = 'en';

  public getLanguage(): Language {
    return this.activeLanguage;
  }

  public setLanguage(lang: Language): void {
    this.activeLanguage = lang;
  }

  public getSessionMessages(): SafeVoiceMessage[] {
    return [...this.sessionMessages];
  }

  public clearSession(): void {
    this.sessionMessages = [];
  }

  public async sendMessage(userText: string, context?: SafeVoiceContext): Promise<SafeVoiceResponse> {
    const lang = context?.selectedLanguage || this.activeLanguage;
    const timestamp = new Date().toISOString();

    // 1. Client-Side Risk Classification
    const riskAnalysis = riskClassifier.analyzePrompt(userText);

    // Save user message to session memory
    const userMsg: SafeVoiceMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp,
      riskCategory: riskAnalysis.category,
      language: lang
    };
    this.sessionMessages.push(userMsg);

    // If Urgent Risk (Self-harm or Immediate danger), respond with crisis support immediately
    if (riskAnalysis.isUrgent) {
      const urgentResponse: SafeVoiceResponse = {
        message: `${riskAnalysis.safetyNote}\n\nRecommended Urgent Contact:\n${riskAnalysis.recommendedHelplines.map(h => `• ${h.name}: ${h.phone}`).join('\n')}`,
        riskCategory: riskAnalysis.category,
        suggestedActions: [
          'Call Emergency 112',
          'Call Cyber Crime 1930',
          'Contact a trusted person'
        ],
        isDemoFallback: true,
        timestamp: new Date().toISOString()
      };

      const assistantMsg: SafeVoiceMessage = {
        id: `msg_asst_${Date.now()}`,
        sender: 'assistant',
        text: urgentResponse.message,
        timestamp: urgentResponse.timestamp,
        riskCategory: riskAnalysis.category,
        language: lang,
        suggestedActions: urgentResponse.suggestedActions
      };
      this.sessionMessages.push(assistantMsg);

      return urgentResponse;
    }

    // 2. Call FastAPI Backend (`POST /api/safevoice/chat`)
    try {
      const payload = {
        message: userText,
        context: {
          caseStatus: context?.caseStatus,
          detectionLikelihood: context?.detectionLikelihood,
          shieldScanStatus: context?.shieldScanStatus,
          selectedLanguage: lang
        }
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data: SafeVoiceResponse = await response.json();
        
        const assistantMsg: SafeVoiceMessage = {
          id: `msg_asst_${Date.now()}`,
          sender: 'assistant',
          text: data.message,
          timestamp: data.timestamp,
          riskCategory: data.riskCategory,
          language: lang,
          suggestedActions: data.suggestedActions
        };
        this.sessionMessages.push(assistantMsg);

        return data;
      }
    } catch {
      // Offline / API error fallback handled below
    }

    // 3. Demo / Offline Local Guidance Fallback
    const fallbackResponse = this.generateLocalFallback(userText, lang);
    const assistantMsg: SafeVoiceMessage = {
      id: `msg_asst_${Date.now()}`,
      sender: 'assistant',
      text: fallbackResponse.message,
      timestamp: fallbackResponse.timestamp,
      riskCategory: fallbackResponse.riskCategory,
      language: lang,
      suggestedActions: fallbackResponse.suggestedActions
    };
    this.sessionMessages.push(assistantMsg);

    return fallbackResponse;
  }

  public async saveSessionToCase(caseId: string): Promise<void> {
    const caseObj = await shieldDB.getCase(caseId);
    if (caseObj) {
      const sessionSummary = this.sessionMessages
        .map(m => `[${m.sender.toUpperCase()}]: ${m.text}`)
        .join('\n');
      caseObj.notes = `${caseObj.notes}\n\n--- Saved SafeVoice Session (${new Date().toLocaleDateString()}) ---\n${sessionSummary}`;
      await shieldDB.updateCase(caseObj);
    }
  }

  // Local Guidance Fallback Generator
  private generateLocalFallback(prompt: string, lang: Language): SafeVoiceResponse {
    const textLower = prompt.toLowerCase();

    let message = 'I hear you. Facing image-based abuse is stressful, but you are in control here. Let us take one clear step at a time.\n\nFirst, make sure you preserve original raw files and URLs before taking down posts.';
    let suggestedActions = [
      'What should I do first?',
      'How can I document this?',
      'How can I report this?'
    ];

    if (textLower.includes('first') || textLower.includes('what should i do')) {
      message = 'Here is your first step:\n1. Preserve original photos or chat exports without editing or screenshotting.\n2. Do NOT send money or engage with extortion demands.\n3. Take full webpage screenshots showing platform URLs and timestamps.';
      suggestedActions = ['How can I document this?', 'Show my case options'];
    } else if (textLower.includes('document') || textLower.includes('safedoc')) {
      message = 'To document evidence safely:\n• Go to SafeDoc in ShieldHer.\n• Compute the Web Crypto SHA-256 integrity hash.\n• Store incident date and platform details locally.\n• Generate an evidence PDF package.';
      suggestedActions = ['How can I report this?', 'I need someone to talk to'];
    } else if (textLower.includes('report') || textLower.includes('cyber')) {
      message = 'Reporting options in India:\n• StopNCII.org: Suppress intimate image sharing across major social platforms.\n• National Cyber Crime Helpline: Call 1930 or visit cybercrime.gov.in.\n• NCW Cyber Cell: Dedicated helpline at 7827170170.';
      suggestedActions = ['I need someone to talk to', 'What should I do first?'];
    } else if (textLower.includes('guilty') || textLower.includes('court') || textLower.includes('legal')) {
      message = 'SafeVoice provides decision-support information, not legal advice or court certainty. Under India IT Act Sections 66E and 67A, non-consensual sharing is a punishable offense. A legal advocate or cyber cell officer can provide formal legal advice.';
      suggestedActions = ['How can I document this?', 'Contact helpline'];
    }

    // Language specific greeting adaptations
    if (lang === 'ta') {
      message = `[தமிழ் வழிகாட்டல்]\n${message}`;
    } else if (lang === 'hi') {
      message = `[हिंदी मार्गदर्शन]\n${message}`;
    }

    return {
      message,
      riskCategory: 'NORMAL_SUPPORT',
      suggestedActions,
      isDemoFallback: true,
      timestamp: new Date().toISOString()
    };
  }
}

export const safeVoiceService = new SafeVoiceService();
