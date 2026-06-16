import { describe, it, expect } from 'vitest';
import { PROPOSAL_STATUS_LABEL, PROPOSAL_STATUS_TONE } from './ProposalStatus';

describe('PROPOSAL_STATUS_LABEL', () => {
  it.each([
    ['PENDIENTE', 'Pendiente'],
    ['ACEPTADA', 'Aceptada'],
    ['RECHAZADA', 'Rechazada'],
    ['CANCELADA', 'Cancelada'],
  ] as const)('maps %s → %s', (status, label) => {
    expect(PROPOSAL_STATUS_LABEL[status]).toBe(label);
  });
});

describe('PROPOSAL_STATUS_TONE', () => {
  it('PENDIENTE → warning', () => expect(PROPOSAL_STATUS_TONE.PENDIENTE).toBe('warning'));
  it('ACEPTADA → success', () => expect(PROPOSAL_STATUS_TONE.ACEPTADA).toBe('success'));
  it('RECHAZADA → error', () => expect(PROPOSAL_STATUS_TONE.RECHAZADA).toBe('error'));
  it('CANCELADA → error', () => expect(PROPOSAL_STATUS_TONE.CANCELADA).toBe('error'));
});
