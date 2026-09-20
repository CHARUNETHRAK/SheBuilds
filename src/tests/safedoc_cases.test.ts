import { describe, it, expect, beforeEach } from 'vitest';
import { shieldDB } from '../storage/db';
import { IncidentCase, EvidenceRecord } from '../types';

describe('SafeDoc Case & Evidence Record Management Suite', () => {
  beforeEach(async () => {
    await shieldDB.clearAllLocalData();
  });

  it('saves and retrieves an IncidentCase', async () => {
    const mockCase: IncidentCase = {
      id: 'inc_test_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      incidentDate: '2026-03-01',
      discoveryDate: '2026-03-02',
      platform: 'Instagram',
      sourceUrl: 'https://instagram.com/p/test',
      description: 'Harassment incident',
      evidenceIds: [],
      status: 'Active'
    };

    const id = await shieldDB.saveIncidentCase(mockCase);
    expect(id).toBe('inc_test_1');

    const fetched = await shieldDB.getIncidentCase('inc_test_1');
    expect(fetched).not.toBeNull();
    expect(fetched?.platform).toBe('Instagram');
  });

  it('saves, retrieves, and links EvidenceRecord to IncidentCase', async () => {
    const mockRecord: EvidenceRecord = {
      id: 'evrec_test_1',
      caseId: 'inc_test_1',
      fileName: 'evidence_photo.jpg',
      mediaType: 'image/jpeg',
      fileSize: 2048,
      sha256: 'a1b2c3d4e5f6',
      createdAt: new Date().toISOString(),
      capturedAt: '2026-03-01',
      metadataSummary: {
        width: 1920,
        height: 1080,
        rawFindings: ['EXIF parsed']
      },
      notes: 'Test evidence note',
      encryptionStatus: 'Plaintext'
    };

    await shieldDB.saveEvidenceRecord(mockRecord);
    const fetched = await shieldDB.getEvidenceRecord('evrec_test_1');
    expect(fetched?.fileName).toBe('evidence_photo.jpg');

    const caseRecords = await shieldDB.getAllEvidenceRecords('inc_test_1');
    expect(caseRecords.length).toBe(1);
  });

  it('permanently deletes IncidentCase and all associated EvidenceRecords from IndexedDB', async () => {
    const mockCase: IncidentCase = {
      id: 'inc_test_delete',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      incidentDate: '2026-03-01',
      discoveryDate: '2026-03-02',
      platform: 'Telegram',
      description: 'Delete test',
      evidenceIds: ['evrec_test_delete'],
      status: 'Active'
    };

    const mockRecord: EvidenceRecord = {
      id: 'evrec_test_delete',
      caseId: 'inc_test_delete',
      fileName: 'to_delete.jpg',
      mediaType: 'image/jpeg',
      fileSize: 1024,
      sha256: 'deadbeef',
      createdAt: new Date().toISOString(),
      capturedAt: '2026-03-01',
      metadataSummary: { rawFindings: [] },
      notes: '',
      encryptionStatus: 'Plaintext'
    };

    await shieldDB.saveIncidentCase(mockCase);
    await shieldDB.saveEvidenceRecord(mockRecord);

    await shieldDB.deleteIncidentCase('inc_test_delete');

    const fetchedCase = await shieldDB.getIncidentCase('inc_test_delete');
    const fetchedRecords = await shieldDB.getAllEvidenceRecords('inc_test_delete');

    expect(fetchedCase).toBeNull();
    expect(fetchedRecords.length).toBe(0);
  });
});
