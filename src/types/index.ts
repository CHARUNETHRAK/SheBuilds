export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml';

export interface UserPreferences {
  language: Language;
  privacyMode: boolean; // Default true (100% On-Device)
  quickExitUrl: string;
  theme: 'dark' | 'light' | 'system';
  localEncryptionEnabled: boolean;
  onboardingCompleted: boolean;
  lastBackupDate?: string;
}

export interface MediaAsset {
  id: string;
  caseId?: string;
  name: string;
  size: number;
  type: string;
  sha256Hash: string;
  perceptualHash?: string;
  dateAdded: string;
  previewUrl?: string; // Stored locally as object URL or base64 blob
  metadata?: {
    width?: number;
    height?: number;
    exifRemoved?: boolean;
    deviceModel?: string;
    creationTime?: string;
    software?: string;
  };
}

export type LikelihoodLevel = 'Low' | 'Medium' | 'Medium-High' | 'High';

export interface DeepDetectReport {
  assetId: string;
  timestamp: string;
  likelihood: LikelihoodLevel;
  confidenceScore: number; // 0 to 100 percentage
  reasons: string[];
  metadataFindings: {
    exifPresent: boolean;
    cameraModel?: string;
    software?: string;
    timestamp?: string;
    rawFindings: string[];
  };
  faceConsistencyFindings: {
    faceDetected: boolean;
    landmarkCount: number;
    boundaryAnomalies: boolean;
    details: string[];
  };
  processingLocation: 'On-device';
  disclaimer: string;
  isDemoModel: boolean;
}

export interface DetectionResult {
  assetId: string;
  timestamp: string;
  riskScore: number; // 0 to 100
  manipulationFlags: {
    facialReshaping: boolean;
    deepfakeArtifacts: boolean;
    metadataInconsistency: boolean;
    compressionAnomalies: boolean;
  };
  hashMatched: boolean;
  matchDetails?: {
    database: string;
    hashType: string;
    matchConfidence: number;
  };
  recommendations: string[];
  report?: DeepDetectReport;
}

export interface HashEntry {
  id: string;
  hash: string;
  hashAlgorithm: 'dHash-v1' | 'pHash-v1' | 'sha256';
  createdAt: string;
  sourceType: 'community' | 'official_index' | 'user_local';
  verificationStatus: 'verified' | 'unverified' | 'pending';
  moderationStatus: 'active' | 'archived';
  metadataVersion: string;
}

export type ShieldScanMatchStatus = 'MATCH' | 'NO_MATCH' | 'UNKNOWN';

export interface ShieldScanResult {
  status: ShieldScanMatchStatus;
  message: string;
  perceptualHash: string;
  sha256Hash: string;
  matchedEntry?: HashEntry;
}

export type RiskCategory = 'NORMAL_SUPPORT' | 'URGENT_SAFETY_CONCERN' | 'IMMEDIATE_DANGER' | 'SELF_HARM_INDICATION';

export interface SafeVoiceMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  riskCategory?: RiskCategory;
  language: Language;
  suggestedActions?: string[];
}

export interface SafeVoiceContext {
  caseStatus?: string;
  detectionLikelihood?: string;
  shieldScanStatus?: string;
  selectedLanguage: Language;
}

export interface SafeVoiceResponse {
  message: string;
  riskCategory: RiskCategory;
  suggestedActions: string[];
  isDemoFallback: boolean;
  timestamp: string;
}

export interface EvidenceRecord {
  id: string;
  caseId: string;
  fileName: string;
  mediaType: string;
  fileSize: number;
  sha256: string;
  createdAt: string; // ISO 8601
  capturedAt: string; // ISO 8601
  sourceUrl?: string;
  metadataSummary: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
    rawFindings: string[];
  };
  deepDetectResult?: DeepDetectReport;
  shieldScanResult?: ShieldScanResult;
  notes: string;
  encryptionStatus: 'Encrypted' | 'Plaintext';
}

export type CaseStatus = 'New' | 'Documented' | 'Report Prepared' | 'Reported' | 'Follow-up Needed' | 'Resolved' | 'Closed' | 'Active';

export type TimelineEventType = 
  | 'Incident discovered'
  | 'Evidence added'
  | 'Detection performed'
  | 'Report generated'
  | 'User-added event'
  | 'Follow-up'
  | 'Case status change';

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string; // ISO 8601
  title: string;
  description: string;
  type: TimelineEventType;
  attachmentRef?: string;
}

export type FollowUpType = 'day14' | 'day30' | 'custom';

export interface FollowUp {
  id: string;
  caseId: string;
  type: FollowUpType;
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface IncidentCase {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  incidentDate: string;
  discoveryDate: string;
  platform: string;
  sourceUrl?: string;
  description: string;
  evidenceIds: string[];
  status: CaseStatus;
  timelineEvents?: TimelineEvent[];
  followUps?: FollowUp[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isMandatory: boolean;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  platform: 'Instagram' | 'WhatsApp' | 'Telegram' | 'Facebook' | 'Twitter/X' | 'Website' | 'Other';
  platformUrl?: string;
  incidentDate: string;
  perpetratorInfo?: {
    username?: string;
    phone?: string;
    profileUrl?: string;
    additionalDetails?: string;
  };
  notes: string;
  mediaAssets: MediaAsset[];
  hashSignature: string; // Web Crypto SHA256 of combined item metadata
  dateCreated: string;
  deepDetectReport?: DeepDetectReport;
  shieldScanResult?: ShieldScanResult;
}

export interface Case {
  id: string;
  title: string;
  category: 'Image Manipulation' | 'Non-Consensual Sharing' | 'Extortion/Blackmail' | 'Harassment' | 'Other';
  status: CaseStatus;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  dateCreated: string;
  dateUpdated: string;
  evidenceCount: number;
  notes: string;
  followUps: FollowUp[];
  timelineEvents?: TimelineEvent[];
}

export type SupportCategory = 'counsellor' | 'NGO' | 'legal aid' | 'campus support' | 'cyber support';

export interface SupportContact {
  id: string;
  organization: string;
  name?: string;
  category: SupportCategory;
  language: string[];
  location: string;
  contactMethod: 'Phone' | 'Email' | 'Website' | 'Helpline';
  contactValue: string;
  verificationStatus: 'verified' | 'demo_unverified';
  verifiedAt: string;
  source: string;
  active: boolean;
  description: string;
  isDemo: boolean;
}

export interface SanitizedCaseSummary {
  caseId: string;
  sanitizedPlatform: string;
  incidentDate: string;
  evidenceCount: number;
  hasIntegrityHash: boolean;
  deepDetectLikelihood?: string;
  shieldScanStatus?: string;
  sanitizedDescription: string;
  generatedAt: string;
}

export interface ConsentRecord {
  id: string;
  timestamp: string;
  consentGiven: boolean;
  scope: 'local_only' | 'anonymous_telemetry' | 'server_screening';
  version: string;
}
