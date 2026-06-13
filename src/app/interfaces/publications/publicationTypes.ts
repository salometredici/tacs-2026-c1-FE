import type { StatusTone } from '../../components/common/StatusBadge';

export type PublicationStatus = 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

export const PUBLICATION_STATUS_LABEL: Record<PublicationStatus, string> = {
  ACTIVA: 'Activa',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
};

export const PUBLICATION_STATUS_TONE: Record<PublicationStatus, StatusTone> = {
  ACTIVA: 'success',
  FINALIZADA: 'neutral',
  CANCELADA: 'error',
};
