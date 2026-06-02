import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Notification } from '../../interfaces/Notification';
import StatusBadge from '../common/StatusBadge';

const TYPE_LABELS: Record<string, string> = {
  TRADE_PROPOSAL_RECEIVED: 'Propuesta de intercambio recibida',
  TRADE_PROPOSAL_ACCEPTED: 'Propuesta de intercambio aceptada',
  TRADE_PROPOSAL_REJECTED: 'Propuesta de intercambio rechazada',
  AUCTION_OFFER_RECEIVED: 'Oferta de subasta recibida',
  AUCTION_OFFER_ACCEPTED: 'Oferta de subasta aceptada',
  AUCTION_OFFER_REJECTED: 'Oferta de subasta rechazada',
  AUCTION_CANCELLED: 'Subasta cancelada',
  AUCTION_ENDING_SOON: 'Subasta por cerrar',
  WANTED_CARD_AVAILABLE_IN_AUCTION: 'Figurita buscada disponible en subasta',
  WANTED_CARD_AVAILABLE_IN_PUBLICATION: 'Figurita buscada disponible en publicación',
};

function getNavigatePath(n: Notification): string | null {
  if (n.type.startsWith('TRADE_PROPOSAL')) return '/proposals';
  if (n.type.startsWith('AUCTION_') || n.type === 'WANTED_CARD_AVAILABLE_IN_AUCTION') {
    return n.referenceId ? `/auctions/${n.referenceId}` : null;
  }
  if (n.type === 'WANTED_CARD_AVAILABLE_IN_PUBLICATION') {
    return n.referenceId ? `/publications/${n.referenceId}` : null;
  }
  return null;
}

function getNavigateLabel(n: Notification): string {
  if (n.type.startsWith('TRADE_PROPOSAL')) return 'Ir a propuestas';
  if (n.type.startsWith('AUCTION_') || n.type === 'WANTED_CARD_AVAILABLE_IN_AUCTION') return 'Ir a subasta';
  if (n.type === 'WANTED_CARD_AVAILABLE_IN_PUBLICATION') return 'Ir a publicación';
  return '';
}

interface Props {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationDetail({ notification, onClose }: Props) {
  const navigate = useNavigate();
  const n = notification;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleNavigate = () => {
    const path = getNavigatePath(n);
    if (path) {
      onClose();
      navigate(path);
    }
  };

  const path = getNavigatePath(n);

  return (
    <Overlay onClick={onClose}>
      <Card onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} title="Cerrar">
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </CloseButton>

        <NotificationMessage>{n.message}</NotificationMessage>

        <TypeLabel>{TYPE_LABELS[n.type] ?? n.type}</TypeLabel>

        <StatusBadge tone={n.read ? 'neutral' : 'info'}>
          {n.read ? 'Leída' : 'No leída'}
        </StatusBadge>

        {path && (
          <NavigateButton onClick={handleNavigate}>
            {getNavigateLabel(n)}
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </NavigateButton>
        )}
      </Card>
    </Overlay>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: ${theme.spacing.md};
`;

const Card = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.extraLarge};
  padding: ${theme.spacing.xl};
  max-width: 480px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.elevation[3]};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: none;
  border: none;
  color: ${theme.colors.onSurfaceVariant};
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: ${theme.shape.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover::after { opacity: ${theme.state.hover}; }

  & .material-symbols-outlined { font-size: 20px; }
`;

const NotificationMessage = styled.p`
  font-size: ${theme.typography.bodyLarge.fontSize};
  line-height: ${theme.typography.bodyLarge.lineHeight};
  color: ${theme.colors.onSurface};
  margin: 0;
  padding-right: ${theme.spacing.xl};
`;

const TypeLabel = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

// M3 Filled Tonal Button
const NavigateButton = styled.button`
  align-self: flex-start;
  margin-top: ${theme.spacing.xs};
  padding: 8px 20px;
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSecondaryContainer};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }

  & .material-symbols-outlined { font-size: 1rem; }
`;
