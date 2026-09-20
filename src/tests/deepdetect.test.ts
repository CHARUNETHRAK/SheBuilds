import { describe, it, expect } from 'vitest';
import { deepDetectEngine } from '../features/deepdetect/DeepDetectEngine';

describe('DeepDetect Engine & Model Adapter Suite', () => {
  it('reports correct development model status', () => {
    const status = deepDetectEngine.getModelStatus();
    expect(status.isDemoMode).toBe(true);
    expect(status.location).toBe('public/models/deepdetect/');
    expect(status.modelName).toContain('Demo');
  });

  it('provides trauma-informed explanation text', () => {
    const explanation = deepDetectEngine.getExplanation();
    expect(explanation).toContain('on-device');
    expect(explanation).toContain('statistical likelihood');
  });

  it('analyzes standard photo file and outputs low likelihood report with disclaimer', async () => {
    const mockFile = new File(['mock_image_bytes'], 'normal_photo.jpg', { type: 'image/jpeg' });
    const report = await deepDetectEngine.analyzeImage(mockFile);

    expect(report.likelihood).toBe('Low');
    expect(report.confidenceScore).toBeLessThan(50);
    expect(report.processingLocation).toBe('On-device');
    expect(report.disclaimer).toBe('This is a screening result, not proof. A forensic expert can provide a formal opinion.');
  });

  it('detects suspect media indicators and outputs medium-high likelihood', async () => {
    const suspectFile = new File(['fake_media_bytes'], 'fake_deepfake_test.jpg', { type: 'image/jpeg' });
    const report = await deepDetectEngine.analyzeImage(suspectFile);

    expect(report.likelihood).toBe('Medium-High');
    expect(report.confidenceScore).toBeGreaterThan(50);
    expect(report.reasons.length).toBeGreaterThan(0);
    expect(report.disclaimer).toContain('screening result, not proof');
  });

  it('analyzes video file and returns valid video report', async () => {
    const videoFile = new File(['video_bytes'], 'test_video.mp4', { type: 'video/mp4' });
    const report = await deepDetectEngine.analyzeVideo(videoFile);

    expect(report.processingLocation).toBe('On-device');
    expect(report.faceConsistencyFindings.faceDetected).toBe(true);
    expect(report.disclaimer).toBeDefined();
  });
});
