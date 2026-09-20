import { describe, it, expect } from 'vitest';
import { riskClassifier } from '../features/safevoice/RiskClassifier';

describe('SafeVoice RiskClassifier Safety Suite', () => {
  it('classifies standard documentation queries as NORMAL_SUPPORT', () => {
    const res = riskClassifier.analyzePrompt('How do I document evidence in SafeDoc?');
    expect(res.category).toBe('NORMAL_SUPPORT');
    expect(res.isUrgent).toBe(false);
    expect(res.recommendedHelplines.length).toBe(0);
  });

  it('detects active extortion blackmail as URGENT_SAFETY_CONCERN', () => {
    const res = riskClassifier.analyzePrompt('Someone is demanding money for blackmail');
    expect(res.category).toBe('URGENT_SAFETY_CONCERN');
    expect(res.isUrgent).toBe(true);
    expect(res.recommendedHelplines.some(h => h.phone === '1930')).toBe(true);
  });

  it('detects physical threats as IMMEDIATE_DANGER', () => {
    const res = riskClassifier.analyzePrompt('Someone is following me and outside my house right now');
    expect(res.category).toBe('IMMEDIATE_DANGER');
    expect(res.isUrgent).toBe(true);
    expect(res.recommendedHelplines.some(h => h.phone.includes('112'))).toBe(true);
  });

  it('detects self-harm expressions as SELF_HARM_INDICATION and provides crisis helplines', () => {
    const res = riskClassifier.analyzePrompt('I feel so hopeless I want to end my life');
    expect(res.category).toBe('SELF_HARM_INDICATION');
    expect(res.isUrgent).toBe(true);
    expect(res.recommendedHelplines.some(h => h.name.includes('Vandrevala'))).toBe(true);
    expect(res.safetyNote).toBeDefined();
  });
});
