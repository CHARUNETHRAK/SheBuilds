import React, { useState } from 'react';
import { Cpu, Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { deepDetectEngine } from './DeepDetectEngine';
import { MediaUpload } from './MediaUpload';
import { MediaPreview } from './MediaPreview';
import { ProcessingState } from './ProcessingState';
import { ResultScreen } from './ResultScreen';
import { DeepDetectReport, Case, EvidenceItem } from '../../types';
import { calculateSHA256 } from '../../security/crypto';
import { shieldDB } from '../../storage/db';

interface DeepDetectViewProps {
  onNavigateToEvidence?: () => void;
  onProceedToShieldScan?: (file: File, report: DeepDetectReport) => void;
}

export const DeepDetectView: React.FC<DeepDetectViewProps> = ({
  onNavigateToEvidence,
  onProceedToShieldScan
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [report, setReport] = useState<DeepDetectReport | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const modelStatus = deepDetectEngine.getModelStatus();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setReport(null);
    setSavedSuccess(false);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setReport(null);
    setSavedSuccess(false);
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStage('Parsing image header and EXIF metadata tags...');

    await new Promise(r => setTimeout(r, 400));
    setAnalysisProgress(45);
    setAnalysisStage('Screening frequency domain edge gradients & boundary anomalies...');

    await new Promise(r => setTimeout(r, 400));
    setAnalysisProgress(75);
    setAnalysisStage('Running DeepDetect local inference adapter...');

    await new Promise(r => setTimeout(r, 400));
    setAnalysisProgress(100);

    const generatedReport = selectedFile.type.startsWith('video')
      ? await deepDetectEngine.analyzeVideo(selectedFile)
      : await deepDetectEngine.analyzeImage(selectedFile);

    setReport(generatedReport);
    setAnalyzing(false);
  };

  const handleSaveToEvidence = async () => {
    if (!selectedFile || !report) return;

    const buffer = await selectedFile.arrayBuffer();
    const sha256 = await calculateSHA256(buffer);

    // Get default case or create new
    const cases = await shieldDB.getAllCases();
    let caseId = cases.length > 0 ? cases[0].id : '';

    if (!caseId) {
      const newCase: Case = {
        id: `case_${Date.now()}`,
        title: `DeepDetect Analysis - ${selectedFile.name}`,
        category: 'Image Manipulation',
        status: 'Active',
        severity: report.likelihood === 'High' || report.likelihood === 'Medium-High' ? 'High' : 'Medium',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        evidenceCount: 1,
        notes: `Likelihood: ${report.likelihood}, Confidence: ${report.confidenceScore}%`,
        followUps: []
      };
      await shieldDB.saveCase(newCase);
      caseId = newCase.id;
    }

    const evidenceItem: EvidenceItem = {
      id: `ev_${Date.now()}`,
      caseId,
      title: `DeepDetect Screening Report: ${selectedFile.name}`,
      platform: 'Other',
      incidentDate: new Date().toISOString().split('T')[0],
      notes: `Likelihood: ${report.likelihood}\nConfidence: ${report.confidenceScore}%\nReasons: ${report.reasons.join('; ')}\nSHA-256: ${sha256}`,
      mediaAssets: [
        {
          id: `asset_${Date.now()}`,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          sha256Hash: sha256,
          dateAdded: new Date().toISOString()
        }
      ],
      hashSignature: sha256,
      dateCreated: new Date().toISOString(),
      deepDetectReport: report
    };

    await shieldDB.saveEvidence(evidenceItem);
    setSavedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.deepdetect}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Client-side media manipulation likelihood screening.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <span>Model: {modelStatus.modelName}</span>
          </div>
        </div>
      </div>

      {/* Main Content Step Flow */}
      {!selectedFile && (
        <MediaUpload onFileSelect={handleFileSelect} />
      )}

      {selectedFile && !analyzing && !report && (
        <div className="space-y-4">
          <MediaPreview file={selectedFile} onClear={handleClearFile} />
          
          <div className="flex justify-end">
            <button
              onClick={handleStartAnalysis}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition"
            >
              <Cpu className="w-4 h-4" />
              <span>Analyse Media On-Device</span>
            </button>
          </div>
        </div>
      )}

      {analyzing && (
        <ProcessingState progress={analysisProgress} stageMessage={analysisStage} />
      )}

      {report && (
        <ResultScreen
          report={report}
          onSaveToEvidence={handleSaveToEvidence}
          onProceedToShieldScan={() => {
            if (selectedFile && onProceedToShieldScan) {
              onProceedToShieldScan(selectedFile, report);
            }
          }}
          savedSuccess={savedSuccess}
        />
      )}
    </div>
  );
};
