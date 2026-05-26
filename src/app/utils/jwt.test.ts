import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { decodeJwt, getRoleFromToken } from './jwt';

// A minimal valid JWT with payload { sub: "user1", role: "USER", exp: 9999999999 }
// Header and signature are fake but the base64url payload is real.
const USER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'user1', role: 'USER', exp: 9999999999 }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') +
  '.fake_signature';

const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.' +
  btoa(JSON.stringify({ sub: 'admin1', role: 'ADMIN', exp: 9999999999 }))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') +
  '.fake_signature';

describe('decodeJwt', () => {
  it('decodes a valid token and returns the payload', () => {
    const result = decodeJwt(USER_TOKEN);
    expect(result).not.toBeNull();
    expect(result?.sub).toBe('user1');
    expect(result?.role).toBe('USER');
  });

  it('returns null for a string that is not a JWT', () => {
    expect(decodeJwt('not-a-jwt')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(decodeJwt('')).toBeNull();
  });

  it('returns null when the payload segment is not valid base64', () => {
    expect(decodeJwt('header.!!!.signature')).toBeNull();
  });

  it('decodes an ADMIN token correctly', () => {
    const result = decodeJwt(ADMIN_TOKEN);
    expect(result?.role).toBe('ADMIN');
  });
});

describe('getRoleFromToken', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns null when there is no token in localStorage', () => {
    expect(getRoleFromToken()).toBeNull();
  });

  it('returns USER when the stored token has role USER', () => {
    localStorage.setItem('token', USER_TOKEN);
    expect(getRoleFromToken()).toBe('USER');
  });

  it('returns ADMIN when the stored token has role ADMIN', () => {
    localStorage.setItem('token', ADMIN_TOKEN);
    expect(getRoleFromToken()).toBe('ADMIN');
  });

  it('returns null when the stored token is malformed', () => {
    localStorage.setItem('token', 'garbage');
    expect(getRoleFromToken()).toBeNull();
  });
});
