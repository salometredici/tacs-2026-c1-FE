// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CatalogPreviewSection from './CatalogPreviewSection';
import type { Card } from '../../../interfaces/cards/Card';

afterEach(cleanup);

const makeCard = (id: string, description: string): Card => ({
  id,
  number: 1,
  type: 'JUGADOR',
  description,
  country: null,
  team: null,
  category: 'COMUN',
});

describe('CatalogPreviewSection', () => {
  it('renders each card id and description', () => {
    const cards = [makeCard('ARG10', 'Messi'), makeCard('BRA7', 'Neymar')];
    render(<CatalogPreviewSection catalogPreview={cards} onViewAll={vi.fn()} />);
    expect(screen.getByText('ARG10')).toBeTruthy();
    expect(screen.getByText('Messi')).toBeTruthy();
    expect(screen.getByText('BRA7')).toBeTruthy();
    expect(screen.getByText('Neymar')).toBeTruthy();
  });

  it('calls onViewAll when "Ver todo el catálogo" is clicked', () => {
    const onViewAll = vi.fn();
    render(<CatalogPreviewSection catalogPreview={[makeCard('A1', 'X')]} onViewAll={onViewAll} />);
    fireEvent.click(screen.getByText(/Ver todo el catálogo/));
    expect(onViewAll).toHaveBeenCalledOnce();
  });

  it('calls onViewAll when a card is clicked', () => {
    const onViewAll = vi.fn();
    render(<CatalogPreviewSection catalogPreview={[makeCard('ARG10', 'Messi')]} onViewAll={onViewAll} />);
    fireEvent.click(screen.getByText('Messi').parentElement!);
    expect(onViewAll).toHaveBeenCalled();
  });

  it('renders the section title', () => {
    render(<CatalogPreviewSection catalogPreview={[]} onViewAll={vi.fn()} />);
    expect(screen.getByText('Catálogo de Figuritas')).toBeTruthy();
  });
});
