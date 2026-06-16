import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getTopAuctionByOffers, getMostWantedCards } from './AdminStatsService';

vi.mock('axios');

const mockGet = axios.get as ReturnType<typeof vi.fn>;

beforeEach(() => vi.clearAllMocks());

describe('AdminStatsService — getTopAuctionByOffers', () => {
  it('devuelve null cuando el BE responde 204 No Content', async () => {
    mockGet.mockResolvedValue({ status: 204, data: '' });
    expect(await getTopAuctionByOffers()).toBeNull();
  });

  it('devuelve null cuando data viene vacía', async () => {
    mockGet.mockResolvedValue({ status: 200, data: '' });
    expect(await getTopAuctionByOffers()).toBeNull();
  });

  it('devuelve la entry cuando hay datos', async () => {
    const entry = {
      auctionId: 'a1', cardId: 'ARG1', cardDescription: 'Messi',
      publisherName: 'Ana', pendingOffers: 3, totalOffers: 5,
    };
    mockGet.mockResolvedValue({ status: 200, data: entry });
    expect(await getTopAuctionByOffers()).toEqual(entry);
  });
});

describe('AdminStatsService — getMostWantedCards', () => {
  it('pasa days por query param (default 7)', async () => {
    mockGet.mockResolvedValue({ status: 200, data: [] });
    await getMostWantedCards();
    expect(mockGet).toHaveBeenCalledWith(expect.any(String), { params: { days: 7 } });
  });
});
