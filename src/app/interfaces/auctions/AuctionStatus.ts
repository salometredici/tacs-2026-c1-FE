import type { StatusTone } from '../../components/common/StatusBadge';

export type AuctionStatus = 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

export const AUCTION_STATUS_LABEL: Record<AuctionStatus, string> = {
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

// Loose a propósito: incluye DESIERTA (subasta sin ofertas), que el BE puede devolver
// y no está en el type AuctionStatus.
export const AUCTION_STATUS_TONE: Record<string, StatusTone> = {
  ACTIVA: 'success',
  FINALIZADA: 'neutral',
  CANCELADA: 'error',
  DESIERTA: 'neutral',
};
