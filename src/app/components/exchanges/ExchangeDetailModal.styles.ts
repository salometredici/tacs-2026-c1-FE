import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ExchangeOriginType } from '../../interfaces/exchanges/ExchangeOrigin';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

export const Modal = styled.div`
  background: ${theme.colors.surfaceContainerHigh};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[3]};
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

export const ModalTitle = styled.h2`
  color: ${theme.colors.onSurface};
  margin: 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
`;

export const ModalSubtitle = styled.p`
  margin: 4px 0 0 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// M3 Icon Button (standard)
export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  border: none;
  background: none;
  cursor: pointer;
  color: ${theme.colors.onSurfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:hover { background: ${theme.colors.surfaceContainerHighest}; }

  & .material-symbols-outlined { font-size: 20px; }
`;

// Layout horizontal para header secundario (action chip + status badge)
export const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

// M3 Suggestion Chip (clickable) – linkea al origen del intercambio
export const OriginBadge = styled.button<{ $type: ExchangeOriginType }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  border: none;
  cursor: pointer;
  background: ${({ $type }) => $type === 'SUBASTA' ? theme.colors.primaryContainer : theme.colors.secondaryContainer};
  color: ${({ $type }) => $type === 'SUBASTA' ? theme.colors.onPrimaryContainer : theme.colors.onSecondaryContainer};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $type }) => $type === 'SUBASTA' ? theme.colors.onPrimaryContainer : theme.colors.onSecondaryContainer};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }
  &:hover::after { opacity: ${theme.state.hover}; }

  & .material-symbols-outlined { font-size: 16px; }
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.section`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ColumnLabel = styled.h3`
  margin: 0;
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurfaceVariant};
  letter-spacing: 0.04em;
`;

export const PartyRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.bodyLarge.fontSize};
  color: ${theme.colors.onSurface};
`;

export const PartyAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${theme.shape.full};
`;

export const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  border-top: 1px solid ${theme.colors.outlineVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurface};
  &:first-of-type { border-top: none; }
`;

export const CardMeta = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const FeedbackBlock = styled.div`
  background: ${theme.colors.surfaceContainerLowest};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.small};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const FeedbackHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.typography.labelMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const FeedbackComment = styled.p`
  margin: 0;
  color: ${theme.colors.onSurface};
  font-size: ${theme.typography.bodyMedium.fontSize};
  font-style: italic;
`;

export const FeedbackPending = styled.p`
  margin: 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
  font-style: italic;
`;

export const FeedbackTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.small};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  font-family: inherit;
  font-size: ${theme.typography.bodyMedium.fontSize};
  resize: vertical;
  &:focus { outline: 2px solid ${theme.colors.primary}; outline-offset: -1px; }
`;

export const FeedbackFormActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
`;

export const SecondaryButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: transparent;
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.full};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

export const FooterButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.shape.full};
  color: ${theme.colors.onPrimary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
`;
