import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getExchangesByUserId, submitFeedback } from './ExchangesService';

vi.mock('axios');

const mockGet = axios.get as ReturnType<typeof vi.fn>;
const mockPost = axios.post as ReturnType<typeof vi.fn>;

beforeEach(() => { vi.clearAllMocks(); });

describe('ExchangesService — getExchangesByUserId', () => {
  it('desempaqueta el listado paginado (response.data.data)', async () => {
    const exchanges = [{ id: 'ex-1' }, { id: 'ex-2' }];
    mockGet.mockResolvedValue({ data: { data: exchanges, currentPage: 0, totalPages: 1 } });
    const result = await getExchangesByUserId('user-1');
    expect(result).toEqual(exchanges);
    expect(mockGet).toHaveBeenCalledWith(expect.any(String), { params: { userId: 'user-1' } });
  });
});

describe('ExchangesService — submitFeedback', () => {
  it('postea el feedback al endpoint del intercambio', async () => {
    mockPost.mockResolvedValue({ data: {} });
    await submitFeedback('ex-1', { score: 5, comment: 'genial' });
    expect(mockPost).toHaveBeenCalledWith(expect.stringContaining('ex-1'), { score: 5, comment: 'genial' });
  });
});
