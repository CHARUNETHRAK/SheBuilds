import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Mock Web Crypto API for tests if needed
if (!globalThis.crypto) {
  (globalThis as any).crypto = {
    subtle: {
      digest: async (algo: string, data: ArrayBuffer) => {
        return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]).buffer;
      }
    },
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    }
  };
}

// Mock URL.createObjectURL & revokeObjectURL in jsdom test runner if missing
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = (blob: Blob | MediaSource) => 'blob:mock_url_' + Math.random().toString(36).substring(2);
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = (url: string) => {};
}
