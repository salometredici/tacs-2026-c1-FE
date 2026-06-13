import type { StatusTone } from '../../components/common/StatusBadge';

export type ProposalStatus = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  PENDIENTE: 'Pendiente',
  ACEPTADA: 'Aceptada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
};

export const PROPOSAL_STATUS_TONE: Record<ProposalStatus, StatusTone> = {
  PENDIENTE: 'warning',
  ACEPTADA: 'success',
  RECHAZADA: 'error',
  CANCELADA: 'error',
};
