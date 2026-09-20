import { describe, it, expect, vi } from 'vitest';
import { calculateSHA256 } from '../security/crypto';
import { encryptionService } from '../security/EncryptionService';

describe('SafeDoc Crypto & EncryptionService Suite', () => {
  it('calculates consistent SHA-256 hashes for raw text data', async () => {
    const hash1 = await calculateSHA256('test_evidence_content');
    const hash2 = await calculateSHA256('test_evidence_content');
    const hash3 = await calculateSHA256('different_content');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBeGreaterThan(0);
  });

  it('encrypts and decrypts sensitive evidence descriptions correctly', async () => {
    await encryptionService.generateKey();
    const plainText = 'Confidential survivor incident statement';
    
    const encrypted = await encryptionService.encrypt(plainText);
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();

    const decrypted = await encryptionService.decrypt(encrypted);
    expect(decrypted).toBe(plainText);

    encryptionService.deleteKey();
  });

  it('verifies zero console.log invocations during encryption operations', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    await encryptionService.encrypt('Sensitive file URL and description');

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
