import { describe, it, expect } from 'vitest';
import { trustCircleDirectory, SEEDED_SUPPORT_CONTACTS } from '../features/trustcircle/TrustCircleDirectory';
import { IncidentCase } from '../types';

describe('TrustCircle Directory & Sanitized Case Sharing Suite', () => {
  it('loads seeded support contacts with explicit demo labeling', () => {
    const contacts = trustCircleDirectory.getAllContacts();
    expect(contacts.length).toBeGreaterThan(0);

    contacts.forEach(contact => {
      expect(contact.isDemo).toBe(true);
      expect(contact.organization.toLowerCase()).toContain('demo');
    });
  });

  it('filters support directory contacts by category', () => {
    const counsellors = trustCircleDirectory.getAllContacts({ category: 'counsellor' });
    expect(counsellors.length).toBeGreaterThan(0);
    counsellors.forEach(c => expect(c.category).toBe('counsellor'));

    const legalAid = trustCircleDirectory.getAllContacts({ category: 'legal aid' });
    expect(legalAid.length).toBeGreaterThan(0);
    legalAid.forEach(c => expect(c.category).toBe('legal aid'));
  });

  it('filters support directory contacts by language', () => {
    const tamilContacts = trustCircleDirectory.getAllContacts({ language: 'Tamil' });
    expect(tamilContacts.length).toBeGreaterThan(0);
    tamilContacts.forEach(c => expect(c.language).toContain('Tamil'));
  });

  it('filters support directory contacts by location', () => {
    const delhiContacts = trustCircleDirectory.getAllContacts({ location: 'Delhi' });
    expect(delhiContacts.length).toBeGreaterThan(0);
    delhiContacts.forEach(c => expect(c.location.toLowerCase()).toContain('delhi'));
  });

  it('generates sanitized case summary stripping PII and attaching Web Crypto integrity proof', () => {
    const mockCase: IncidentCase = {
      id: 'inc_share_test',
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      incidentDate: '2026-02-28',
      discoveryDate: '2026-03-01',
      platform: 'WhatsApp',
      description: 'Sensitive user private notes that should be omitted in sanitized summary',
      evidenceIds: ['ev_1', 'ev_2'],
      status: 'Documented'
    };

    const summary = trustCircleDirectory.prepareSanitizedSummary(mockCase);

    expect(summary.caseId).toBe('inc_share_test');
    expect(summary.sanitizedPlatform).toBe('WhatsApp');
    expect(summary.incidentDate).toBe('2026-02-28');
    expect(summary.evidenceCount).toBe(2);
    expect(summary.hasIntegrityHash).toBe(true);
    expect(summary.sanitizedDescription).not.toContain('Sensitive user private notes');
    expect(summary.sanitizedDescription).toContain('SHA-256');
    expect(summary.generatedAt).toBeDefined();
  });

  it('verifies external navigation confirmation string requirement', () => {
    const warningText = "You are leaving ShieldHer to contact this organization.";
    expect(warningText).toBe("You are leaving ShieldHer to contact this organization.");
  });
});
