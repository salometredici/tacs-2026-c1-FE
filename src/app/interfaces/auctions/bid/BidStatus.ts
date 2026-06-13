import type { StatusTone } from '../../../components/common/StatusBadge';

export type BidStatus = 'ACTIVA' | 'SUPERADA' | 'GANADORA' | 'RECHAZADA' | 'CANCELADA';

export const BID_STATUS_TONE: Record<BidStatus, StatusTone> = {
  ACTIVA: 'info',
  SUPERADA: 'warning',
  GANADORA: 'success',
  RECHAZADA: 'error',
  CANCELADA: 'error',
};
