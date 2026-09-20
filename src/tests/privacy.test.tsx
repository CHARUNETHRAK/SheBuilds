import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import App from '../App';

describe('ShieldHer Privacy Center Suite', () => {
  afterEach(cleanup);

  it('renders Privacy Center transparency section and data stats', () => {
    render(<App />);
    const privacyTabs = screen.getAllByText(/Privacy Center/i);
    fireEvent.click(privacyTabs[0]);

    expect(screen.getByText(/Data Processing Transparency/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Case Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete All Local Data/i)).toBeInTheDocument();
  });
});
