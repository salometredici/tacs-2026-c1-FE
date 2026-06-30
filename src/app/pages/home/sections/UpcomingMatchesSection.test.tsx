// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import UpcomingMatchesSection from './UpcomingMatchesSection';
import type { UpcomingMatch } from '../../../interfaces/matches/UpcomingMatch';

afterEach(cleanup);

const makeMatch = (overrides: Partial<UpcomingMatch> = {}): UpcomingMatch => ({
  homeTeam: 'Mexico',
  homeCrest: 'https://x/mex.png',
  awayTeam: 'Canada',
  awayCrest: 'https://x/can.png',
  kickoff: '2027-06-11T19:00:00Z', // futuro lejano → countdown positivo
  venue: 'Estadio Azteca',
  round: 'Group Stage - 1',
  ...overrides,
});

describe('UpcomingMatchesSection — loading', () => {
  it('shows loading message when loading=true', () => {
    render(<UpcomingMatchesSection matches={[]} loading={true} />);
    expect(screen.getByText('Cargando partidos...')).toBeTruthy();
  });
});

describe('UpcomingMatchesSection — empty', () => {
  it('shows empty message when there are no matches', () => {
    render(<UpcomingMatchesSection matches={[]} loading={false} />);
    expect(screen.getByText(/No hay próximos partidos/)).toBeTruthy();
  });
});

describe('UpcomingMatchesSection — with matches', () => {
  it('renders team names and venue for each match', () => {
    render(<UpcomingMatchesSection matches={[makeMatch(), makeMatch({ homeTeam: 'Brazil', awayTeam: 'Croatia' })]} loading={false} />);
    expect(screen.getByText('Mexico')).toBeTruthy();
    expect(screen.getByText('Canada')).toBeTruthy();
    expect(screen.getByText('Brazil')).toBeTruthy();
    expect(screen.getByText('Croatia')).toBeTruthy();
    expect(screen.getAllByText(/Estadio Azteca/).length).toBeGreaterThan(0);
  });

  it('shows the countdown to the first (future) match', () => {
    render(<UpcomingMatchesSection matches={[makeMatch()]} loading={false} />);
    expect(screen.getByText('Próximo partido en')).toBeTruthy();
    // formato "Nd HHh MMm SSs"
    expect(screen.getByText(/\d+d \d{2}h \d{2}m \d{2}s/)).toBeTruthy();
  });

  it('does not show the countdown when the first match is already in the past', () => {
    render(<UpcomingMatchesSection matches={[makeMatch({ kickoff: '2020-01-01T00:00:00Z' })]} loading={false} />);
    expect(screen.queryByText('Próximo partido en')).toBeNull();
    // la fila del partido igual se muestra
    expect(screen.getByText('Mexico')).toBeTruthy();
  });
});
