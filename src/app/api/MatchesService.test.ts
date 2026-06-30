import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getUpcomingMatches } from './MatchesService';

vi.mock('axios');

const mockGet = axios.get as ReturnType<typeof vi.fn>;

beforeEach(() => { vi.clearAllMocks(); });

describe('MatchesService — getUpcomingMatches', () => {
  it('pega a /matches/upcoming y devuelve los partidos', async () => {
    const matches = [
      { homeTeam: 'Mexico', homeCrest: null, awayTeam: 'Canada', awayCrest: null,
        kickoff: '2026-06-11T19:00:00Z', venue: null, round: 'GROUP_STAGE' },
    ];
    mockGet.mockResolvedValue({ data: matches });

    const result = await getUpcomingMatches();

    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('/matches/upcoming'));
    expect(result).toEqual(matches);
  });

  it('devuelve [] cuando la respuesta no trae data', async () => {
    mockGet.mockResolvedValue({ data: undefined });
    expect(await getUpcomingMatches()).toEqual([]);
  });
});
