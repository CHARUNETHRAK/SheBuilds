import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import App from '../App';

describe('ShieldHer Quick Exit Privacy Suite', () => {
  afterEach(cleanup);

  it('switches instantly to NeutralView on Quick Exit button click', () => {
    const { container } = render(<App />);
    const quickExitHeaderBtn = container.querySelector('#quick-exit-header')!;
    fireEvent.click(quickExitHeaderBtn);

    expect(screen.getByText(/Daily Weather & Life/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Forecast/i)).toBeInTheDocument();
    expect(document.title).toBe('Weather & Daily Life Updates');
  });

  it('triggers Quick Exit when Escape key is pressed anywhere', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.getByText(/Daily Weather & Life/i)).toBeInTheDocument();
    expect(document.title).toBe('Weather & Daily Life Updates');
  });
});
