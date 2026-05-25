/**
 * Decodifica el payload de un JWT sin verificar firma (eso lo hace el BE).
 * Solo sirve para leer claims públicos del FE (ej. role del usuario logueado).
 */

export type UserRole = 'USER' | 'ADMIN';

export interface JwtPayload {
  sub?: string;
  role?: UserRole;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(): UserRole | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = decodeJwt(token);
  if (decoded?.role === 'ADMIN' || decoded?.role === 'USER') return decoded.role;
  return null;
}
