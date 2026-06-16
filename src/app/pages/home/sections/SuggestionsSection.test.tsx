// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SuggestionsSection from './SuggestionsSection';
import type { SuggestionResult } from '../../../interfaces/suggestions/SuggestionResult';

afterEach(cleanup);

const makeSuggestion = (overrides: Partial<SuggestionResult> = {}): SuggestionResult => ({
  sourceType: 'PUBLICATION',
  sourceId: 'pub-1',
  cardId: 'ARG10',
  cardNumber: 10,
  cardDescription: 'Lionel Messi',
  cardCountry: 'Argentina',
  cardTeam: null,
  cardCategory: 'LEGENDARIO',
  publisherUserId: 'u1',
  publisherName: 'Carlos',
  publisherAvatarId: 'avatar_1',
  generatedAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('SuggestionsSection — loading', () => {
  it('shows loading message when loading=true', () => {
    render(<SuggestionsSection suggestions={[]} loading={true} onItemClick={vi.fn()} />);
    expect(screen.getByText('Cargando sugerencias...')).toBeTruthy();
  });
});

describe('SuggestionsSection — empty', () => {
  it('shows empty message when no suggestions', () => {
    render(<SuggestionsSection suggestions={[]} loading={false} onItemClick={vi.fn()} />);
    expect(screen.getByText(/No hay sugerencias/)).toBeTruthy();
  });
});

describe('SuggestionsSection — with suggestions', () => {
  const suggestions = [
    makeSuggestion({ sourceType: 'PUBLICATION', sourceId: 'pub-1', cardId: 'ARG10', cardDescription: 'Messi' }),
    makeSuggestion({ sourceType: 'AUCTION', sourceId: 'auc-1', cardId: 'BRA7', cardDescription: 'Neymar', publisherName: 'Pepe' }),
  ];

  it('renders card IDs and descriptions', () => {
    render(<SuggestionsSection suggestions={suggestions} loading={false} onItemClick={vi.fn()} />);
    expect(screen.getByText('ARG10')).toBeTruthy();
    expect(screen.getByText('Messi')).toBeTruthy();
    expect(screen.getByText('BRA7')).toBeTruthy();
    expect(screen.getByText('Neymar')).toBeTruthy();
  });

  it('shows "Ofrecida por" for PUBLICATION type and "Subastada por" for AUCTION', () => {
    render(<SuggestionsSection suggestions={suggestions} loading={false} onItemClick={vi.fn()} />);
    expect(screen.getByText(/Ofrecida por Carlos/)).toBeTruthy();
    expect(screen.getByText(/Subastada por Pepe/)).toBeTruthy();
  });

  it('calls onItemClick with sourceType and sourceId when a card is clicked', () => {
    const onItemClick = vi.fn();
    render(<SuggestionsSection suggestions={[suggestions[0]]} loading={false} onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('Messi').closest('[onClick]') ?? screen.getByText('ARG10'));
    // click the card itself — find any ancestor with onClick
    const card = screen.getByText('ARG10').parentElement!;
    fireEvent.click(card);
    expect(onItemClick).toHaveBeenCalledWith('PUBLICATION', 'pub-1');
  });
});
