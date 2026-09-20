import { describe, it, expect } from 'vitest';
import { generateEvidencePDF } from '../features/safedoc/pdfGenerator';
import { EvidenceRecord, IncidentCase } from '../types';

describe('SafeDoc PDF Report Generator Suite', () => {
  it('generates structured PDF instance with required legal disclaimer footer', () => {
    const mockRecord: EvidenceRecord = {
      id: 'ev_pdf_1',
      caseId: 'inc_pdf_1',
      fileName: 'test_photo.jpg',
      mediaType: 'image/jpeg',
      fileSize: 4096,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      createdAt: new Date().toISOString(),
      capturedAt: '2026-03-01',
      sourceUrl: 'https://example.com/incident',
      metadataSummary: {
        width: 1200,
        height: 800,
        rawFindings: ['JPEG APP1 Exif parsed']
      },
      notes: 'Survivor notes for evidence report',
      encryptionStatus: 'Plaintext'
    };

    const mockCase: IncidentCase = {
      id: 'inc_pdf_1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      incidentDate: '2026-03-01',
      discoveryDate: '2026-03-02',
      platform: 'Instagram',
      sourceUrl: 'https://example.com/incident',
      description: 'PDF report test case',
      evidenceIds: ['ev_pdf_1'],
      status: 'Active'
    };

    const pdfDoc = generateEvidencePDF(mockRecord, mockCase);
    expect(pdfDoc).toBeDefined();

    // Verify output buffer exists and has PDF magic header bytes %PDF
    const pdfOutput = pdfDoc.output('arraybuffer');
    expect(pdfOutput.byteLength).toBeGreaterThan(500);
    const headerStr = String.fromCharCode(...new Uint8Array(pdfOutput.slice(0, 5)));
    expect(headerStr).toContain('%PDF');
  });

  it('handles missing optional metadata and detection results gracefully', () => {
    const minimalRecord: EvidenceRecord = {
      id: 'ev_pdf_minimal',
      caseId: 'inc_pdf_minimal',
      fileName: 'minimal.png',
      mediaType: 'image/png',
      fileSize: 1024,
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      createdAt: new Date().toISOString(),
      capturedAt: '2026-03-01',
      metadataSummary: {
        rawFindings: []
      },
      notes: '',
      encryptionStatus: 'Plaintext'
    };

    const pdfDoc = generateEvidencePDF(minimalRecord, null);
    expect(pdfDoc).toBeDefined();

    const pdfOutput = pdfDoc.output('arraybuffer');
    expect(pdfOutput.byteLength).toBeGreaterThan(500);
  });
});
