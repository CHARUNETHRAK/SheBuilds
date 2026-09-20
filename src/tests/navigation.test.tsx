import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import App from '../App';

describe('ShieldHer Navigation & Layout Suite', () => {
  afterEach(cleanup);

  it('renders the ShieldHer logo and headline on Landing Page', () => {
    render(<App />);
    expect(screen.getAllByText(/ShieldHer/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Start Safely/i)).toBeInTheDocument();
  });

  it('navigates to Privacy Intro when Start Safely is clicked', () => {
    render(<App />);
    const startBtn = screen.getByText(/Start Safely/i);
    fireEvent.click(startBtn);
    expect(screen.getByText(/Understanding Your Privacy on ShieldHer/i)).toBeInTheDocument();
  });

  it('navigates through Header tabs directly', () => {
    render(<App />);
    const dashboardTab = screen.getAllByRole('button', { name: /^Dashboard$/i })[0];
    fireEvent.click(dashboardTab);
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
  });
});
