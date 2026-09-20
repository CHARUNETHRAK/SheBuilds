import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MediaPreview } from '../features/deepdetect/MediaPreview';

describe('Privacy & Memory Cleanup Lifecycle Suite', () => {
  it('creates and revokes Object URLs during MediaPreview lifecycle', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test_url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const testFile = new File(['test_content'], 'privacy_test.jpg', { type: 'image/jpeg' });
    const { unmount } = render(<MediaPreview file={testFile} onClear={() => {}} />);

    expect(createObjectURLSpy).toHaveBeenCalled();

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test_url');

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});
