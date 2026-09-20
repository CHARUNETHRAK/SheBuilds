import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import App from '../App';

describe('ShieldHer i18n & Language Switching Suite', () => {
  afterEach(cleanup);

  it('opens language selector and switches to Tamil', () => {
    const { container } = render(<App />);
    const langBtn = container.querySelector('#language-selector-btn')!;
    fireEvent.click(langBtn);

    const tamilOption = screen.getByText('தமிழ்');
    fireEvent.click(tamilOption);

    // Verify Tamil headline text is rendered
    expect(screen.getByText(/பாதுகாப்பாக தொடங்குங்கள்/i)).toBeInTheDocument();
  });

  it('switches to Hindi seamlessly', () => {
    const { container } = render(<App />);
    const langBtn = container.querySelector('#language-selector-btn')!;
    fireEvent.click(langBtn);

    const hindiOption = screen.getByText('हिन्दी');
    fireEvent.click(hindiOption);

    // Verify Hindi headline text is rendered
    expect(screen.getByText(/सुरक्षित रूप से शुरू करें/i)).toBeInTheDocument();
  });
});
