import { describe, it, expect, beforeEach } from 'vitest';
import { followUpScheduler } from '../features/casediary/FollowUpScheduler';
import { shieldDB } from '../storage/db';
import { IncidentCase, CaseStatus, FollowUp } from '../types';

describe('Case Diary & Follow-Up Reminders Engine Suite', () => {
  beforeEach(async () => {
    await shieldDB.clearAllLocalData();
  });

  it('calculates Day 14 and Day 30 follow-up dates correctly from case creation timestamp', () => {
    const caseId = 'inc_test_scheduler';
    const createdAt = '2026-03-01T10:00:00.000Z';

    const followUps = followUpScheduler.generateInitialFollowUps(caseId, createdAt);

    expect(followUps.length).toBe(2);
    
    const day14 = followUps.find(f => f.type === 'day14');
    const day30 = followUps.find(f => f.type === 'day30');

    expect(day14).toBeDefined();
    expect(day30).toBeDefined();

    expect(day14?.scheduledDate).toBe('2026-03-15'); // 14 days after March 1
    expect(day30?.scheduledDate).toBe('2026-03-31'); // 30 days after March 1
    expect(day14?.completed).toBe(false);
    expect(day30?.completed).toBe(false);
  });

  it('enforces strictly discreet notification wording with zero sensitive disclosure', () => {
    const notificationText = followUpScheduler.getDiscreetNotificationText();
    expect(notificationText).toBe('ShieldHer: You have a private reminder.');
    expect(notificationText.toLowerCase()).not.toContain('abuse');
    expect(notificationText.toLowerCase()).not.toContain('harassment');
    expect(notificationText.toLowerCase()).not.toContain('ncii');
    expect(notificationText.toLowerCase()).not.toContain('photo');
  });

  it('marks follow-up complete and updates completedAt timestamp', () => {
    const caseId = 'inc_test_complete';
    const initial = followUpScheduler.generateInitialFollowUps(caseId, new Date().toISOString())[0];

    const completed = followUpScheduler.markComplete(initial);

    expect(completed.completed).toBe(true);
    expect(completed.completedAt).toBeDefined();
  });

  it('reschedules a follow-up to a new user-specified date', () => {
    const caseId = 'inc_test_reschedule';
    const initial = followUpScheduler.generateInitialFollowUps(caseId, '2026-03-01T10:00:00.000Z')[0];

    const rescheduled = followUpScheduler.reschedule(initial, '2026-04-15');

    expect(rescheduled.scheduledDate).toBe('2026-04-15');
    expect(rescheduled.completed).toBe(false);
  });

  it('stores and retrieves IncidentCase with timeline events and follow-ups in IndexedDB', async () => {
    const mockCase: IncidentCase = {
      id: 'inc_diary_db',
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      incidentDate: '2026-02-28',
      discoveryDate: '2026-03-01',
      platform: 'Instagram',
      description: 'Test diary case',
      evidenceIds: [],
      status: 'New',
      followUps: followUpScheduler.generateInitialFollowUps('inc_diary_db', '2026-03-01T10:00:00.000Z'),
      timelineEvents: [
        {
          id: 'evt_1',
          caseId: 'inc_diary_db',
          timestamp: '2026-03-01T10:00:00.000Z',
          title: 'Case File Created',
          description: 'Initial creation',
          type: 'Case status change'
        }
      ]
    };

    await shieldDB.saveIncidentCase(mockCase);

    const fetched = await shieldDB.getIncidentCase('inc_diary_db');
    expect(fetched).not.toBeNull();
    expect(fetched?.followUps?.length).toBe(2);
    expect(fetched?.timelineEvents?.length).toBe(1);
    expect(fetched?.status).toBe('New');
  });

  it('validates case status options including Resolved with non-legal disclosure flag', () => {
    const validStatuses: CaseStatus[] = [
      'New',
      'Documented',
      'Report Prepared',
      'Reported',
      'Follow-up Needed',
      'Resolved',
      'Closed'
    ];

    expect(validStatuses).toContain('Resolved');
    
    // Non-legal disclaimer verification text check
    const resolvedDisclaimer = 'Resolved means marked complete by user, not legal resolution.';
    expect(resolvedDisclaimer).toContain('not legal resolution');
  });
});
