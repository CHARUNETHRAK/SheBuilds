/**
 * RiskClassifier Safety Module
 * 
 * Performs rule-based risk classification on user prompts BEFORE AI generation.
 * 
 * RISK CATEGORIES:
 * - NORMAL_SUPPORT: Standard decision-support and documentation queries.
 * - URGENT_SAFETY_CONCERN: Active extortion, blackmail, or imminent online distribution.
 * - IMMEDIATE_DANGER: Physical safety threat, stalking, or immediate emergency.
 * - SELF_HARM_INDICATION: Self-harm, suicidal ideation, or severe acute crisis.
 * 
 * IMPORTANT: Does NOT attempt to diagnose mental health conditions or determine guilt.
 */

import { RiskCategory } from '../../types';

export interface RiskAnalysisResult {
  category: RiskCategory;
  isUrgent: boolean;
  recommendedHelplines: Array<{ name: string; phone: string }>;
  safetyNote?: string;
}

export class RiskClassifier {
  private selfHarmKeywords = [
    'die', 'suicide', 'kill myself', 'end my life', 'don\'t want to live',
    'hurt myself', 'self-harm', 'thookku', 'saaga', 'aatmhatya'
  ];

  private immediateDangerKeywords = [
    'outside my house', 'following me', 'breaking in', 'physical threat',
    'stabbing', 'beating', 'in danger now', 'help me right now', 'threatened to kill'
  ];

  private urgentConcernKeywords = [
    'extortion', 'blackmail', 'demand money', 'posting in 1 hour',
    'leaking today', 'pay money', 'pay bitcoin', 'threatened to send to family'
  ];

  public analyzePrompt(userText: string): RiskAnalysisResult {
    const textLower = userText.toLowerCase();

    // 1. Self-Harm Indication Check
    if (this.selfHarmKeywords.some(kw => textLower.includes(kw))) {
      return {
        category: 'SELF_HARM_INDICATION',
        isUrgent: true,
        recommendedHelplines: [
          { name: 'Vandrevala Foundation Helpline', phone: '+91 9999 666 555' },
          { name: 'iCALL Mental Health Helpline', phone: '9152987821' },
          { name: 'KIRAN National Mental Health Helpline', phone: '1800-599-0019' }
        ],
        safetyNote: 'Your life and well-being are valuable. Please reach out to a trained counselor or trusted person immediately.'
      };
    }

    // 2. Immediate Danger Check
    if (this.immediateDangerKeywords.some(kw => textLower.includes(kw))) {
      return {
        category: 'IMMEDIATE_DANGER',
        isUrgent: true,
        recommendedHelplines: [
          { name: 'National Emergency Response System', phone: '112' },
          { name: 'Police Helpline', phone: '100 / 112' },
          { name: 'NCW Emergency Helpline', phone: '7827170170' }
        ],
        safetyNote: 'If you are in immediate physical danger, please contact local emergency services (112) or call a trusted person right now.'
      };
    }

    // 3. Urgent Safety Concern Check
    if (this.urgentConcernKeywords.some(kw => textLower.includes(kw))) {
      return {
        category: 'URGENT_SAFETY_CONCERN',
        isUrgent: true,
        recommendedHelplines: [
          { name: 'National Cyber Crime Helpline', phone: '1930' },
          { name: 'National Commission for Women Cyber Cell', phone: '7827170170' }
        ],
        safetyNote: 'Do not pay money or engage with extortion demands. Document evidence and report to Cyber Crime Helpline 1930.'
      };
    }

    // 4. Default Normal Support
    return {
      category: 'NORMAL_SUPPORT',
      isUrgent: false,
      recommendedHelplines: []
    };
  }
}

export const riskClassifier = new RiskClassifier();
