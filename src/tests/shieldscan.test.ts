import { describe, it, expect } from 'vitest';
import { shieldScanService } from '../features/shieldscan/ShieldScanService';
import { stopNCIIProvider } from '../features/shieldscan/StopNCIIProvider';

describe('ShieldScan Service & StopNCII Adapter Suite', () => {
  it('generates a perceptual dHash string locally for an image file', async () => {
    const mockFile = new File(['image_data'], 'sample_photo.jpg', { type: 'image/jpeg' });
    const pHash = await shieldScanService.generatePerceptualHash(mockFile);

    expect(typeof pHash).toBe('string');
    expect(pHash.length).toBeGreaterThan(0);
  });

  it('returns NO_MATCH state when image perceptual hash is not in community list', async () => {
    const res = await shieldScanService.checkCommunityHash('0000000000000000');
    expect(res.status).toBe('NO_MATCH');
    expect(res.message).toBe('No known match was found.');
  });

  it('returns MATCH state when perceptual hash matches protected list', async () => {
    const res = await shieldScanService.checkCommunityHash('8f3a1b9c4e2d7f0a');
    expect(res.status).toBe('MATCH');
    expect(res.message).toBe('Potential match found in the protected hash list.');
    expect(res.matchedEntry).toBeDefined();
    expect(res.matchedEntry?.id).toBe('hash_entry_101');
  });

  it('StopNCIIProvider returns clearly marked INTEGRATION_PENDING status without faking live API', async () => {
    const status = stopNCIIProvider.getStatus();
    expect(status.status).toBe('Integration Pending');
    expect(status.providerName).toBe('StopNCII.org');

    const res = await stopNCIIProvider.checkHash('sample_hash');
    expect(res.status).toBe('INTEGRATION_PENDING');
    expect(res.message).toContain('pending');
  });
});
