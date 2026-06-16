// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import SummaryRow from './SummaryRow';

afterEach(cleanup);

describe('SummaryRow', () => {
  it('renders the label', () => {
    render(<SummaryRow label="Vos entregás">valor</SummaryRow>);
    expect(screen.getByText('Vos entregás')).toBeTruthy();
  });

  it('renders children', () => {
    render(<SummaryRow label="Label">contenido hijo</SummaryRow>);
    expect(screen.getByText('contenido hijo')).toBeTruthy();
  });

  it('renders ReactNode children', () => {
    render(<SummaryRow label="Label"><strong>negrita</strong></SummaryRow>);
    expect(screen.getByText('negrita')).toBeTruthy();
  });
});
