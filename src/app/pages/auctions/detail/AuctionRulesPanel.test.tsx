// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AuctionRulesPanel from './AuctionRulesPanel';

afterEach(cleanup);

const noRules: [] = [];
const rules = [
  { type: 'REPUTACION_MINIMA' as const, value: '3' },
  { type: 'INTERCAMBIOS_MINIMOS' as const, value: '5' },
];

describe('AuctionRulesPanel — empty rules', () => {
  it('shows "Sin restricciones" when rules is empty', () => {
    render(<AuctionRulesPanel rules={noRules} isOwner={false} isActive={true} onPlaceBid={vi.fn()} onCancelAuction={vi.fn()} />);
    expect(screen.getByText(/Sin restricciones/)).toBeTruthy();
  });
});

describe('AuctionRulesPanel — rules list', () => {
  it('renders each rule with its label and value', () => {
    render(<AuctionRulesPanel rules={rules} isOwner={false} isActive={true} onPlaceBid={vi.fn()} onCancelAuction={vi.fn()} />);
    expect(screen.getByText(/Reputación mínima/)).toBeTruthy();
    expect(screen.getByText(/Intercambios mínimos/)).toBeTruthy();
    expect(screen.getByText(/3/)).toBeTruthy();
    expect(screen.getByText(/5/)).toBeTruthy();
  });
});

describe('AuctionRulesPanel — action buttons', () => {
  it('shows "Hacer oferta" when isActive=true and isOwner=false', () => {
    render(<AuctionRulesPanel rules={noRules} isOwner={false} isActive={true} onPlaceBid={vi.fn()} onCancelAuction={vi.fn()} />);
    expect(screen.getByText('Hacer oferta')).toBeTruthy();
    expect(screen.queryByText('Cancelar subasta')).toBeNull();
  });

  it('shows "Cancelar subasta" when isActive=true and isOwner=true', () => {
    render(<AuctionRulesPanel rules={noRules} isOwner={true} isActive={true} onPlaceBid={vi.fn()} onCancelAuction={vi.fn()} />);
    expect(screen.getByText('Cancelar subasta')).toBeTruthy();
    expect(screen.queryByText('Hacer oferta')).toBeNull();
  });

  it('hides both buttons when isActive=false', () => {
    render(<AuctionRulesPanel rules={noRules} isOwner={false} isActive={false} onPlaceBid={vi.fn()} onCancelAuction={vi.fn()} />);
    expect(screen.queryByText('Hacer oferta')).toBeNull();
    expect(screen.queryByText('Cancelar subasta')).toBeNull();
  });

  it('calls onPlaceBid when "Hacer oferta" clicked', () => {
    const onPlaceBid = vi.fn();
    render(<AuctionRulesPanel rules={noRules} isOwner={false} isActive={true} onPlaceBid={onPlaceBid} onCancelAuction={vi.fn()} />);
    fireEvent.click(screen.getByText('Hacer oferta'));
    expect(onPlaceBid).toHaveBeenCalledOnce();
  });

  it('calls onCancelAuction when "Cancelar subasta" clicked', () => {
    const onCancelAuction = vi.fn();
    render(<AuctionRulesPanel rules={noRules} isOwner={true} isActive={true} onPlaceBid={vi.fn()} onCancelAuction={onCancelAuction} />);
    fireEvent.click(screen.getByText('Cancelar subasta'));
    expect(onCancelAuction).toHaveBeenCalledOnce();
  });
});
