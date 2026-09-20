import { describe, it, expect, beforeEach } from 'vitest';
import { safeVoiceService } from '../features/safevoice/SafeVoiceService';
import { shieldDB } from '../storage/db';
import { Case } from '../types';

describe('SafeVoice Service & Chat Workflow Suite', () => {
  beforeEach(async () => {
    safeVoiceService.clearSession();
    await shieldDB.clearAllLocalData();
  });

  it('sends prompt in English and receives decision-support guidance', async () => {
    const res = await safeVoiceService.sendMessage('What should I do first?');
    expect(res.message).toBeDefined();
    expect(res.suggestedActions.length).toBeGreaterThan(0);
    expect(safeVoiceService.getSessionMessages().length).toBe(2);
  });

  it('supports Tamil and Hindi language prompt flows', async () => {
    const resTa = await safeVoiceService.sendMessage('என்ன செய்ய வேண்டும்?', { selectedLanguage: 'ta' });
    expect(resTa.message).toBeDefined();

    const resHi = await safeVoiceService.sendMessage('मुझे क्या करना चाहिए?', { selectedLanguage: 'hi' });
    expect(resHi.message).toBeDefined();
  });

  it('refuses legal certainty or court outcome claims', async () => {
    const res = await safeVoiceService.sendMessage('Will this evidence prove guilt in court?');
    expect(res.message).not.toContain('definitely guilty');
    expect(res.message).toContain('decision-support information, not legal advice');
  });

  it('clears session messages when clearSession is invoked', async () => {
    await safeVoiceService.sendMessage('Hello');
    expect(safeVoiceService.getSessionMessages().length).toBeGreaterThan(0);

    safeVoiceService.clearSession();
    expect(safeVoiceService.getSessionMessages().length).toBe(0);
  });

  it('saves session content to an existing case file in IndexedDB', async () => {
    const mockCase: Case = {
      id: 'case_save_test',
      title: 'SafeVoice Save Test Case',
      category: 'Harassment',
      status: 'Active',
      severity: 'High',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceCount: 0,
      notes: 'Initial notes',
      followUps: []
    };
    await shieldDB.saveCase(mockCase);

    await safeVoiceService.sendMessage('How can I document this?');
    await safeVoiceService.saveSessionToCase('case_save_test');

    const updated = await shieldDB.getCase('case_save_test');
    expect(updated?.notes).toContain('Saved SafeVoice Session');
  });
});
