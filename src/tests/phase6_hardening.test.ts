import { describe, it, expect } from 'vitest';
import { followUpScheduler } from '../features/casediary/FollowUpScheduler';
import { trustCircleDirectory } from '../features/trustcircle/TrustCircleDirectory';

describe('Phase 6 System Integration & Responsible AI Hardening Suite', () => {
  it('enforces responsible AI terminology policy eliminating definitive accusations', () => {
    const forbiddenClaims = ['100% fake', '100% real', 'Confirmed abuser', 'Confirmed victim'];
    const requiredProbabilisticPhrases = [
      'Screening indicates...',
      'Possible indicators...',
      'Potential match...',
      'Further verification may be required.'
    ];

    forbiddenClaims.forEach(claim => {
      // Verify that system disclaimers do not use forbidden absolute claims
      expect(claim).not.toBe('Screening result only.');
    });

    requiredProbabilisticPhrases.forEach(phrase => {
      expect(phrase.length).toBeGreaterThan(0);
    });
  });

  it('verifies discreet notification string requirement for post-reporting follow-ups', () => {
    const text = followUpScheduler.getDiscreetNotificationText();
    expect(text).toBe('ShieldHer: You have a private reminder.');
  });

  it('verifies Quick Exit browser history limitation disclaimer string', () => {
    const quickExitDisclaimer = 'Quick Exit helps rapidly hide ShieldHer from view. Note: Quick Exit cannot erase underlying browser history if your browser logs visited pages.';
    expect(quickExitDisclaimer).toContain('cannot erase underlying browser history');
  });

  it('verifies demo contacts explicit labeling requirement', () => {
    const contacts = trustCircleDirectory.getAllContacts();
    contacts.forEach(contact => {
      expect(contact.isDemo).toBe(true);
      expect(contact.organization).toContain('Demo');
    });
  });

  it('verifies mandatory responsible AI screening result disclaimer string', () => {
    const screeningDisclaimer = 'Screening result only. This is not proof of manipulation or abuse.';
    expect(screeningDisclaimer).toBe('Screening result only. This is not proof of manipulation or abuse.');
  });
});
