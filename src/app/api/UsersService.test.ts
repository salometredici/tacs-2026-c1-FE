import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { addToUserCollection, getUserCollection } from './UsersService';

vi.mock('axios');

const mockPost = axios.post as ReturnType<typeof vi.fn>;
const mockGet = axios.get as ReturnType<typeof vi.fn>;

beforeEach(() => { vi.clearAllMocks(); });

describe('UsersService — addToUserCollection', () => {
  it('postea { cardId, quantity } con la cantidad indicada', async () => {
    mockPost.mockResolvedValue({ data: {} });
    await addToUserCollection('user-1', 'ARG1', 3);
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/users/user-1/collection'),
      { cardId: 'ARG1', quantity: 3 },
    );
  });

  it('defaultea quantity a 1 cuando no se especifica (compat con los otros flujos)', async () => {
    mockPost.mockResolvedValue({ data: {} });
    await addToUserCollection('user-1', 'ARG1');
    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/users/user-1/collection'),
      { cardId: 'ARG1', quantity: 1 },
    );
  });
});

describe('UsersService — getUserCollection', () => {
  it('devuelve response.data', async () => {
    const cards = [{ cardId: 'A', quantity: 2 }];
    mockGet.mockResolvedValue({ data: cards });
    expect(await getUserCollection('user-1')).toEqual(cards);
  });
});
