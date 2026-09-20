import { describe, it, expect, beforeEach } from 'vitest';
import { shieldDB } from '../storage/db';
import { Case, EvidenceItem } from '../types';

describe('ShieldDB IndexedDB Abstraction Layer', () => {
  beforeEach(async () => {
    await shieldDB.clearAllLocalData();
  });

  it('saves and retrieves a case file', async () => {
    const mockCase: Case = {
      id: 'test_case_1',
      title: 'Test Incident',
      category: 'Image Manipulation',
      status: 'Active',
      severity: 'High',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceCount: 1,
      notes: 'Test case notes',
      followUps: []
    };

    const id = await shieldDB.saveCase(mockCase);
    expect(id).toBe('test_case_1');

    const fetched = await shieldDB.getCase('test_case_1');
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Test Incident');
  });

  it('updates an existing case', async () => {
    const mockCase: Case = {
      id: 'test_case_2',
      title: 'Original Title',
      category: 'Harassment',
      status: 'Active',
      severity: 'Medium',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceCount: 0,
      notes: '',
      followUps: []
    };

    await shieldDB.saveCase(mockCase);
    mockCase.title = 'Updated Title';
    await shieldDB.updateCase(mockCase);

    const updated = await shieldDB.getCase('test_case_2');
    expect(updated?.title).toBe('Updated Title');
  });

  it('deletes a case file', async () => {
    const mockCase: Case = {
      id: 'test_case_3',
      title: 'To Be Deleted',
      category: 'Other',
      status: 'Active',
      severity: 'Low',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceCount: 0,
      notes: '',
      followUps: []
    };

    await shieldDB.saveCase(mockCase);
    await shieldDB.deleteCase('test_case_3');

    const deleted = await shieldDB.getCase('test_case_3');
    expect(deleted).toBeNull();
  });

  it('clears all local data completely', async () => {
    const mockCase: Case = {
      id: 'test_case_4',
      title: 'Wipe Test',
      category: 'Harassment',
      status: 'Active',
      severity: 'Medium',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceCount: 0,
      notes: '',
      followUps: []
    };

    await shieldDB.saveCase(mockCase);
    await shieldDB.clearAllLocalData();

    const cases = await shieldDB.getAllCases();
    expect(cases.length).toBe(0);
  });
});
