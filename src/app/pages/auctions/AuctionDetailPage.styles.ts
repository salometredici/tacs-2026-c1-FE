import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  margin-left: -${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.shape.full};
  position: relative;
  overflow: hidden;
  letter-spacing: 0.00625em;

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

// M3 Elevated Card
export const Card = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
  margin-bottom: ${theme.spacing.md};
`;

export const FiguritaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  padding-bottom: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

export const FiguritaNumero = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  min-width: 72px;
  text-align: center;
  background: ${theme.colors.primaryContainer};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.sm};

  @media (max-width: 480px) { font-size: 2rem; min-width: 56px; }
`;

export const FiguritaInfo = styled.div`
  flex: 1;
  h2 { margin: 0 0 0.2rem; font-size: ${theme.typography.titleLarge.fontSize}; font-weight: 400; color: ${theme.colors.onSurface}; }
  p  { margin: 0.15rem 0; font-size: ${theme.typography.bodySmall.fontSize}; color: ${theme.colors.onSurfaceVariant}; }
`;

// M3 Assist Chip – category
export const CategoriaBadge = styled.span<{ $cat: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  background: ${({ $cat }) =>
    $cat === 'LEGENDARIO' ? theme.colors.tertiaryContainer :
    $cat === 'EPICO'      ? theme.colors.primaryContainer :
                             theme.colors.surfaceContainerHighest};
  color: ${({ $cat }) =>
    $cat === 'LEGENDARIO' ? theme.colors.onTertiaryContainer :
    $cat === 'EPICO'      ? theme.colors.onPrimaryContainer :
                             theme.colors.onSurfaceVariant};
`;

// M3 Assist Chip – status
export const EstadoBadge = styled.span<{ $estado: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  background: ${({ $estado }) =>
    $estado === 'ACTIVA'     ? theme.colors.primaryContainer :
    $estado === 'FINALIZADA' ? theme.colors.secondaryContainer :
    $estado === 'DESIERTA'   ? theme.colors.surfaceContainerHighest :
                                theme.colors.errorContainer};
  color: ${({ $estado }) =>
    $estado === 'ACTIVA'     ? theme.colors.onPrimaryContainer :
    $estado === 'FINALIZADA' ? theme.colors.onSecondaryContainer :
    $estado === 'DESIERTA'   ? theme.colors.onSurfaceVariant :
                                theme.colors.onErrorContainer};
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 ${theme.spacing.md};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
  gap: ${theme.spacing.sm};
  &:last-child { border-bottom: none; }
  .label { color: ${theme.colors.onSurfaceVariant}; flex-shrink: 0; }
  .value { font-weight: 500; color: ${theme.colors.onSurface}; text-align: right; }
`;

export const ReglaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} 0;
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurface};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  &:last-child { border-bottom: none; }
  &::before { content: '●'; color: ${theme.colors.primary}; font-size: 0.6rem; }
`;

export const OfertaRow = styled.div<{ $estado: string }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.shape.small};
  background: ${theme.colors.surfaceContainerLowest};
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  border-left: 4px solid ${({ $estado }) =>
    $estado === 'GANADORA' ? theme.colors.success :
    $estado === 'ACTIVA'   ? theme.colors.primary :
    $estado === 'SUPERADA' ? theme.colors.tertiary :
                              theme.colors.outlineVariant};

  @media (max-width: 480px) { flex-direction: column; gap: ${theme.spacing.sm}; }
`;

export const OfertaEstadoBadge = styled.span<{ $estado: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  background: ${({ $estado }) =>
    $estado === 'GANADORA' ? theme.colors.successContainer :
    $estado === 'ACTIVA'   ? theme.colors.primaryContainer :
    $estado === 'SUPERADA' ? theme.colors.tertiaryContainer :
                              theme.colors.surfaceContainerHighest};
  color: ${({ $estado }) =>
    $estado === 'GANADORA' ? theme.colors.success :
    $estado === 'ACTIVA'   ? theme.colors.onPrimaryContainer :
    $estado === 'SUPERADA' ? theme.colors.onTertiaryContainer :
                              theme.colors.onSurfaceVariant};
`;

// M3 Dialog / Full-screen overlay
export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

// M3 Dialog container (extraLarge radius)
export const ConfirmModal = styled.div`
  background: ${theme.colors.surfaceContainerHigh};
  border-radius: ${theme.shape.extraLarge};
  padding: ${theme.spacing.xl};
  max-width: 480px;
  width: 100%;
  box-shadow: ${theme.elevation[3]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  color: ${theme.colors.onSurface};
`;

export const WarningBox = styled.div`
  background: ${theme.colors.tertiaryContainer};
  border-radius: ${theme.shape.small};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onTertiaryContainer};
`;

export const ExchangeSummary = styled.div`
  background: ${theme.colors.surfaceContainerLowest};
  border-radius: ${theme.shape.small};
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.bodyMedium.fontSize};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  .label { color: ${theme.colors.onSurfaceVariant}; font-size: ${theme.typography.labelMedium.fontSize}; text-transform: uppercase; letter-spacing: 0.06em; }
  .value { font-weight: 500; color: ${theme.colors.onSurface}; }
`;

export const ConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

// M3 Text Button
export const CancelBtn = styled.button`
  padding: 10px ${theme.spacing.md};
  background: none;
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  color: ${theme.colors.primary};
  letter-spacing: 0.00625em;
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
  &:disabled { color: rgba(26,28,30,0.38); pointer-events: none; }
`;

// M3 Filled Button (confirm / destructive action)
export const ConfirmBtn = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: ${theme.colors.error};
  color: ${theme.colors.onError};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  letter-spacing: 0.00625em;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onError};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:disabled { background: rgba(26,28,30,0.12); color: rgba(26,28,30,0.38); pointer-events: none; }
`;

// M3 Filled Button (primary action)
export const BidButton = styled.button`
  width: 100%;
  padding: 10px ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  margin-top: ${theme.spacing.md};
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
  &:disabled { background: rgba(26,28,30,0.12); color: rgba(26,28,30,0.38); pointer-events: none; box-shadow: none; }
`;

export const Countdown = styled.div<{ $urgente: boolean }>`
  font-size: ${theme.typography.titleLarge.fontSize};
  font-weight: 700;
  color: ${({ $urgente }) => ($urgente ? theme.colors.error : theme.colors.success)};
`;
