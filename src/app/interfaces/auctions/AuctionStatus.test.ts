import { describe, it, expect } from 'vitest';
import { AUCTION_STATUS_LABEL, AUCTION_STATUS_TONE } from './AuctionStatus';
import { BID_STATUS_TONE } from './bid/BidStatus';
import { RULE_LABELS } from './auctionRule/AuctionRule';

describe('AUCTION_STATUS_LABEL', () => {
  it.each([
    ['ACTIVA', 'Activa'],
    ['FINALIZADA', 'Finalizada'],
    ['CANCELADA', 'Cancelada'],
  ] as const)('maps %s → %s', (status, label) => {
    expect(AUCTION_STATUS_LABEL[status]).toBe(label);
  });
});

describe('AUCTION_STATUS_TONE', () => {
  it.each([
    ['ACTIVA', 'success'],
    ['FINALIZADA', 'neutral'],
    ['CANCELADA', 'error'],
    ['DESIERTA', 'neutral'],
  ])('%s → %s', (status, tone) => {
    expect(AUCTION_STATUS_TONE[status]).toBe(tone);
  });
});

describe('BID_STATUS_TONE', () => {
  it.each([
    ['ACTIVA', 'info'],
    ['SUPERADA', 'warning'],
    ['GANADORA', 'success'],
    ['RECHAZADA', 'error'],
    ['CANCELADA', 'error'],
  ] as const)('%s → %s', (status, tone) => {
    expect(BID_STATUS_TONE[status]).toBe(tone);
  });
});

describe('RULE_LABELS', () => {
  it.each([
    ['REPUTACION_MINIMA', 'Reputación mínima'],
    ['INTERCAMBIOS_MINIMOS', 'Intercambios mínimos'],
    ['CANTIDAD_MINIMA_FIGURITAS', 'Figuritas mínimas en oferta'],
    ['CATEGORIA_MINIMA', 'Categoría mínima de figuritas'],
  ])('maps %s correctly', (type, label) => {
    expect(RULE_LABELS[type]).toBe(label);
  });
});
