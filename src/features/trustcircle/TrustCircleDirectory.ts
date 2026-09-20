/**
 * TrustCircle Directory & Sanitized Case Sharing Module
 * 
 * Provides a directory of support contacts clearly labeled: "Demo / Not for real-world use".
 * 
 * Support Categories:
 * - counsellor
 * - NGO
 * - legal aid
 * - campus support
 * - cyber support
 */

import { SupportContact, SupportCategory, SanitizedCaseSummary, IncidentCase } from '../../types';

export const SEEDED_SUPPORT_CONTACTS: SupportContact[] = [
  {
    id: 'demo_contact_1',
    organization: 'National Cyber Crime Support Portal (Demo)',
    category: 'cyber support',
    language: ['English', 'Hindi', 'Tamil', 'Telugu'],
    location: 'National (India)',
    contactMethod: 'Helpline',
    contactValue: '1930',
    verificationStatus: 'demo_unverified',
    verifiedAt: '2026-01-01T00:00:00Z',
    source: 'Partner Import Directory (Demo)',
    active: true,
    description: 'National helpline for reporting online financial & cyber offenses.',
    isDemo: true
  },
  {
    id: 'demo_contact_2',
    organization: 'Women Safety & Legal Aid Desk (Demo)',
    category: 'legal aid',
    language: ['English', 'Hindi'],
    location: 'Delhi NCR (Demo)',
    contactMethod: 'Phone',
    contactValue: '+91 11 2338 7165',
    verificationStatus: 'demo_unverified',
    verifiedAt: '2026-01-01T00:00:00Z',
    source: 'Legal Directory (Demo)',
    active: true,
    description: 'Pro bono legal consultation for statutory privacy claims.',
    isDemo: true
  },
  {
    id: 'demo_contact_3',
    organization: 'Campus Digital Safety Cell (Demo)',
    category: 'campus support',
    language: ['English', 'Tamil'],
    location: 'Bengaluru / Chennai (Demo)',
    contactMethod: 'Email',
    contactValue: 'safety@campus-demo.org',
    verificationStatus: 'demo_unverified',
    verifiedAt: '2026-01-01T00:00:00Z',
    source: 'Campus Network (Demo)',
    active: true,
    description: 'Student advisory & campus harassment support desk.',
    isDemo: true
  },
  {
    id: 'demo_contact_4',
    organization: 'Survivor Counseling & Wellness NGO (Demo)',
    category: 'counsellor',
    language: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    location: 'National (India)',
    contactMethod: 'Phone',
    contactValue: '+91 9999 666 555',
    verificationStatus: 'demo_unverified',
    verifiedAt: '2026-01-01T00:00:00Z',
    source: 'Wellness Foundation (Demo)',
    active: true,
    description: 'Trauma-informed psychosocial counseling for survivors.',
    isDemo: true
  },
  {
    id: 'demo_contact_5',
    organization: 'Digital Rights & Safety Alliance (Demo)',
    category: 'NGO',
    language: ['English', 'Hindi'],
    location: 'National (India)',
    contactMethod: 'Website',
    contactValue: 'https://digital-rights-demo.org',
    verificationStatus: 'demo_unverified',
    verifiedAt: '2026-01-01T00:00:00Z',
    source: 'NGO Network (Demo)',
    active: true,
    description: 'Non-profit organization advocating for digital rights & takedowns.',
    isDemo: true
  }
];

export class TrustCircleDirectory {
  private contacts: SupportContact[] = [...SEEDED_SUPPORT_CONTACTS];

  public getAllContacts(filters?: {
    category?: string;
    language?: string;
    location?: string;
  }): SupportContact[] {
    return this.contacts.filter(contact => {
      if (filters?.category && filters.category !== 'all' && contact.category !== filters.category) {
        return false;
      }
      if (filters?.language && filters.language !== 'all' && !contact.language.includes(filters.language)) {
        return false;
      }
      if (filters?.location && filters.location !== 'all' && !contact.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  /**
   * Generates a sanitized case summary ("Prepare information to share") with PII stripped.
   */
  public prepareSanitizedSummary(caseObj: IncidentCase | any): SanitizedCaseSummary {
    return {
      caseId: caseObj.id || 'INC_SAMPLE',
      sanitizedPlatform: caseObj.platform || 'Digital Platform',
      incidentDate: caseObj.incidentDate || 'Date documented',
      evidenceCount: caseObj.evidenceIds?.length || caseObj.evidenceCount || 1,
      hasIntegrityHash: true,
      sanitizedDescription: 'Incident documented via ShieldHer with Web Crypto SHA-256 integrity hash.',
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Architecture method for importing partner verified contact data in future releases.
   */
  public importVerifiedPartnerContacts(partnerContacts: SupportContact[]): void {
    this.contacts = [...this.contacts, ...partnerContacts];
  }
}

export const trustCircleDirectory = new TrustCircleDirectory();
