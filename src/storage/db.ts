/**
 * ShieldHer IndexedDB Abstraction Layer (ShieldDB)
 * 
 * Provides an isolated, client-side IndexedDB store for survivor cases, evidence records,
 * preferences, and contacts without direct UI coupling.
 */

import { Case, EvidenceItem, UserPreferences, SupportContact, ConsentRecord, IncidentCase, EvidenceRecord } from '../types';

const DB_NAME = 'ShieldHerDB';
const DB_VERSION = 2;

export const STORES = {
  CASES: 'cases',
  EVIDENCE: 'evidence',
  INCIDENT_CASES: 'incident_cases',
  EVIDENCE_RECORDS: 'evidence_records',
  PREFERENCES: 'preferences',
  CONTACTS: 'contacts',
  CONSENT: 'consent'
} as const;

class ShieldDB {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private inMemoryStore: {
    cases: Map<string, Case>;
    evidence: Map<string, EvidenceItem>;
    incidentCases: Map<string, IncidentCase>;
    evidenceRecords: Map<string, EvidenceRecord>;
    preferences: UserPreferences | null;
    contacts: Map<string, SupportContact>;
    consent: ConsentRecord | null;
  } = {
    cases: new Map(),
    evidence: new Map(),
    incidentCases: new Map(),
    evidenceRecords: new Map(),
    preferences: null,
    contacts: new Map(),
    consent: null
  };

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.CASES)) {
          const caseStore = db.createObjectStore(STORES.CASES, { keyPath: 'id' });
          caseStore.createIndex('dateCreated', 'dateCreated', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.EVIDENCE)) {
          const evidenceStore = db.createObjectStore(STORES.EVIDENCE, { keyPath: 'id' });
          evidenceStore.createIndex('caseId', 'caseId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.INCIDENT_CASES)) {
          db.createObjectStore(STORES.INCIDENT_CASES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.EVIDENCE_RECORDS)) {
          const evRecordStore = db.createObjectStore(STORES.EVIDENCE_RECORDS, { keyPath: 'id' });
          evRecordStore.createIndex('caseId', 'caseId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains(STORES.CONTACTS)) {
          db.createObjectStore(STORES.CONTACTS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.CONSENT)) {
          db.createObjectStore(STORES.CONSENT, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- Phase 3 IncidentCase & EvidenceRecord Management ---

  async saveIncidentCase(caseData: IncidentCase): Promise<string> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.INCIDENT_CASES, 'readwrite');
        const store = tx.objectStore(STORES.INCIDENT_CASES);
        const req = store.put(caseData);
        req.onsuccess = () => resolve(caseData.id);
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.inMemoryStore.incidentCases.set(caseData.id, caseData);
      return caseData.id;
    }
  }

  async getIncidentCase(id: string): Promise<IncidentCase | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.INCIDENT_CASES, 'readonly');
        const store = tx.objectStore(STORES.INCIDENT_CASES);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.inMemoryStore.incidentCases.get(id) || null;
    }
  }

  async getAllIncidentCases(): Promise<IncidentCase[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.INCIDENT_CASES, 'readonly');
        const store = tx.objectStore(STORES.INCIDENT_CASES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return Array.from(this.inMemoryStore.incidentCases.values());
    }
  }

  async deleteIncidentCase(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORES.INCIDENT_CASES, STORES.EVIDENCE_RECORDS], 'readwrite');
        const caseStore = tx.objectStore(STORES.INCIDENT_CASES);
        const evStore = tx.objectStore(STORES.EVIDENCE_RECORDS);
        
        caseStore.delete(id);
        const index = evStore.index('caseId');
        const req = index.getAllKeys(id);
        req.onsuccess = () => {
          req.result.forEach(k => evStore.delete(k));
          resolve();
        };
        req.onerror = () => resolve();
      });
    } catch {
      this.inMemoryStore.incidentCases.delete(id);
      for (const [evId, ev] of this.inMemoryStore.evidenceRecords.entries()) {
        if (ev.caseId === id) this.inMemoryStore.evidenceRecords.delete(evId);
      }
    }
  }

  async saveEvidenceRecord(record: EvidenceRecord): Promise<string> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.EVIDENCE_RECORDS);
        const req = store.put(record);
        req.onsuccess = () => resolve(record.id);
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.inMemoryStore.evidenceRecords.set(record.id, record);
      return record.id;
    }
  }

  async getEvidenceRecord(id: string): Promise<EvidenceRecord | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE_RECORDS, 'readonly');
        const store = tx.objectStore(STORES.EVIDENCE_RECORDS);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.inMemoryStore.evidenceRecords.get(id) || null;
    }
  }

  async getAllEvidenceRecords(caseId?: string): Promise<EvidenceRecord[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE_RECORDS, 'readonly');
        const store = tx.objectStore(STORES.EVIDENCE_RECORDS);
        
        if (caseId) {
          const index = store.index('caseId');
          const req = index.getAll(caseId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        } else {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        }
      });
    } catch {
      const list = Array.from(this.inMemoryStore.evidenceRecords.values());
      return caseId ? list.filter(e => e.caseId === caseId) : list;
    }
  }

  async deleteEvidenceRecord(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.EVIDENCE_RECORDS);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.inMemoryStore.evidenceRecords.delete(id);
    }
  }

  // --- Phase 1 Legacy Case & Evidence Support ---

  async saveCase(caseData: Case): Promise<string> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.CASES, 'readwrite');
        const store = tx.objectStore(STORES.CASES);
        const req = store.put(caseData);
        req.onsuccess = () => resolve(caseData.id);
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.inMemoryStore.cases.set(caseData.id, caseData);
      return caseData.id;
    }
  }

  async getCase(id: string): Promise<Case | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.CASES, 'readonly');
        const store = tx.objectStore(STORES.CASES);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.inMemoryStore.cases.get(id) || null;
    }
  }

  async getAllCases(): Promise<Case[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.CASES, 'readonly');
        const store = tx.objectStore(STORES.CASES);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return Array.from(this.inMemoryStore.cases.values());
    }
  }

  async updateCase(caseData: Case): Promise<void> {
    caseData.dateUpdated = new Date().toISOString();
    await this.saveCase(caseData);
  }

  async deleteCase(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORES.CASES, STORES.EVIDENCE], 'readwrite');
        const caseStore = tx.objectStore(STORES.CASES);
        const evidenceStore = tx.objectStore(STORES.EVIDENCE);
        
        caseStore.delete(id);
        const index = evidenceStore.index('caseId');
        const getEvReq = index.getAllKeys(id);
        getEvReq.onsuccess = () => {
          getEvReq.result.forEach(k => evidenceStore.delete(k));
          resolve();
        };
        getEvReq.onerror = () => resolve();
      });
    } catch {
      this.inMemoryStore.cases.delete(id);
    }
  }

  async saveEvidence(evidenceData: EvidenceItem): Promise<string> {
    try {
      const db = await this.getDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE, 'readwrite');
        const store = tx.objectStore(STORES.EVIDENCE);
        const req = store.put(evidenceData);
        req.onsuccess = () => resolve(evidenceData.id);
        req.onerror = () => reject(req.error);
      });
      return evidenceData.id;
    } catch {
      this.inMemoryStore.evidence.set(evidenceData.id, evidenceData);
      return evidenceData.id;
    }
  }

  async getEvidence(caseId?: string): Promise<EvidenceItem[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.EVIDENCE, 'readonly');
        const store = tx.objectStore(STORES.EVIDENCE);
        if (caseId) {
          const index = store.index('caseId');
          const req = index.getAll(caseId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        } else {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        }
      });
    } catch {
      const list = Array.from(this.inMemoryStore.evidence.values());
      return caseId ? list.filter(e => e.caseId === caseId) : list;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.PREFERENCES, 'readwrite');
        const store = tx.objectStore(STORES.PREFERENCES);
        const req = store.put({ key: 'user_preferences', ...preferences });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      this.inMemoryStore.preferences = preferences;
    }
  }

  async getPreferences(): Promise<UserPreferences | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.PREFERENCES, 'readonly');
        const store = tx.objectStore(STORES.PREFERENCES);
        const req = store.get('user_preferences');
        req.onsuccess = () => {
          if (req.result) {
            const { key, ...prefs } = req.result;
            resolve(prefs as UserPreferences);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return this.inMemoryStore.preferences;
    }
  }

  async clearAllLocalData(): Promise<void> {
    try {
      const db = await this.getDB();
      const storeNames = [
        STORES.CASES,
        STORES.EVIDENCE,
        STORES.INCIDENT_CASES,
        STORES.EVIDENCE_RECORDS,
        STORES.PREFERENCES,
        STORES.CONTACTS,
        STORES.CONSENT
      ];
      
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeNames, 'readwrite');
        storeNames.forEach(name => {
          if (db.objectStoreNames.contains(name)) {
            tx.objectStore(name).clear();
          }
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      this.inMemoryStore.cases.clear();
      this.inMemoryStore.evidence.clear();
      this.inMemoryStore.incidentCases.clear();
      this.inMemoryStore.evidenceRecords.clear();
      this.inMemoryStore.preferences = null;
      this.inMemoryStore.contacts.clear();
      this.inMemoryStore.consent = null;
    }
  }

  async exportAllData(): Promise<string> {
    const cases = await this.getAllCases();
    const evidence = await this.getEvidence();
    const incidentCases = await this.getAllIncidentCases();
    const evidenceRecords = await this.getAllEvidenceRecords();
    const prefs = await this.getPreferences();

    return JSON.stringify({
      version: '2.0',
      exportDate: new Date().toISOString(),
      cases,
      evidence,
      incidentCases,
      evidenceRecords,
      preferences: prefs
    }, null, 2);
  }
}

export const shieldDB = new ShieldDB();
