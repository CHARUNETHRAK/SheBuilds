/**
 * FollowUpScheduler Module
 * 
 * Computes automated Day 14 and Day 30 follow-up reminders for survivor cases.
 * 
 * DISCREET NOTIFICATION PRIVACY RULE:
 * Notification content MUST NEVER reveal sensitive details (e.g. no "abuse case", "intimate image").
 * Text is strictly restricted to: "ShieldHer: You have a private reminder."
 */

import { FollowUp } from '../../types';

export class FollowUpScheduler {
  private discreetNotificationText = 'ShieldHer: You have a private reminder.';

  public getDiscreetNotificationText(): string {
    return this.discreetNotificationText;
  }

  /**
   * Calculates automatic Day 14 and Day 30 follow-up reminders from creation date.
   */
  public generateInitialFollowUps(caseId: string, createdAtISO?: string): FollowUp[] {
    const baseDate = createdAtISO ? new Date(createdAtISO) : new Date();

    const day14Date = new Date(baseDate);
    day14Date.setDate(day14Date.getDate() + 14);

    const day30Date = new Date(baseDate);
    day30Date.setDate(day30Date.getDate() + 30);

    const day14FollowUp: FollowUp = {
      id: `fu_day14_${Date.now()}`,
      caseId,
      type: 'day14',
      scheduledDate: day14Date.toISOString().split('T')[0],
      completed: false,
      notes: 'Check status of submitted takedown requests & cyber cell inquiry.'
    };

    const day30FollowUp: FollowUp = {
      id: `fu_day30_${Date.now()}`,
      caseId,
      type: 'day30',
      scheduledDate: day30Date.toISOString().split('T')[0],
      completed: false,
      notes: '30-day review of evidence log & platform compliance status.'
    };

    return [day14FollowUp, day30FollowUp];
  }

  public markComplete(followUp: FollowUp, notes?: string): FollowUp {
    return {
      ...followUp,
      completed: true,
      completedAt: new Date().toISOString(),
      notes: notes || followUp.notes
    };
  }

  public reschedule(followUp: FollowUp, newDateYYYYMMDD: string): FollowUp {
    return {
      ...followUp,
      scheduledDate: newDateYYYYMMDD,
      completed: false
    };
  }

  public skip(followUp: FollowUp): FollowUp {
    return {
      ...followUp,
      completed: true,
      completedAt: new Date().toISOString(),
      notes: followUp.notes ? `${followUp.notes} (Skipped by user)` : 'Skipped by user'
    };
  }
}

export const followUpScheduler = new FollowUpScheduler();
