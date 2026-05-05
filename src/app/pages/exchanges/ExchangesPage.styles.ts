import styled from 'styled-components';
import { ExchangeOriginType } from '../../interfaces/exchanges/ExchangeOrigin';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.onBackground};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  margin: 0 0 ${theme.spacing.xl} 0;
`;

export const ExchangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

// M3 Elevated Card
export const ExchangeCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ExchangeInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const ExchangeTitle = styled.p`
  font-weight: 500;
  color: ${theme.colors.onSurface};
  margin: 0;
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

export const ExchangeDetail = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// M3 Assist Chip
export const TypeBadge = styled.span<{ $type: ExchangeOriginType }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  background: ${({ $type }) => $type === 'SUBASTA' ? theme.colors.primaryContainer : theme.colors.secondaryContainer};
  color: ${({ $type }) => $type === 'SUBASTA' ? theme.colors.onPrimaryContainer : theme.colors.onSecondaryContainer};
`;

// M3 Filled Tonal Button
export const RateButton = styled.button`
  padding: 6px 16px;
  background: ${theme.colors.tertiaryContainer};
  color: ${theme.colors.onTertiaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  white-space: nowrap;
  transition: box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onTertiaryContainer};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
`;

export const RatedLabel = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  font-style: italic;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

// M3 Dialog overlay
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
  max-width: 420px;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const ModalTitle = styled.h2`
  color: ${theme.colors.onSurface};
  margin: 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
`;

export const StarsRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: ${({ $active }) => $active ? theme.colors.tertiary : theme.colors.outlineVariant};
  transition: color 0.1s;
  &:hover { color: ${theme.colors.tertiary}; }
`;

export const CommentInput = styled.textarea`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyMedium.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus { outline: none; border: 2px solid ${theme.colors.primary}; }
  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

// M3 Text Button
export const CancelButton = styled.button`
  padding: 10px ${theme.spacing.md};
  background: none;
  border: none;
  border-radius: ${theme.shape.full};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

// M3 Filled Button
export const SubmitButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.shape.full};
  color: ${theme.colors.onPrimary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:disabled { background: rgba(26,28,30,0.12); color: rgba(26,28,30,0.38); cursor: not-allowed; box-shadow: none; }
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.bodySmall.fontSize};
  margin: 0;
  background: ${theme.colors.errorContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
`;
