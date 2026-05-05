import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { PublicationStatus } from '../../interfaces/publications/publicationTypes';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';

export const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  border: none;
  background: none;
  color: ${theme.colors.onSurfaceVariant};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }
  &:hover::after { opacity: ${theme.state.hover}; }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  color: ${theme.colors.onSurface};
`;

// M3 Elevated Card – publication header
export const PublicationCard = styled.section`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.titleLarge.fontSize};
  font-weight: 500;
  color: ${theme.colors.onSurface};
`;

export const CardMeta = styled.p`
  margin: 0;
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const StatusBadge = styled.span<{ $status: PublicationStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'ACTIVA'      ? theme.colors.successContainer :
    $status === 'FINALIZADA'  ? theme.colors.surfaceContainerHighest :
                                 theme.colors.errorContainer};
  color: ${({ $status }) =>
    $status === 'ACTIVA'      ? theme.colors.success :
    $status === 'FINALIZADA'  ? theme.colors.onSurfaceVariant :
                                 theme.colors.onErrorContainer};
`;

export const CountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const CountLabel = styled.div`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const CountValue = styled.strong`
  color: ${theme.colors.onSurface};
  font-weight: 600;
`;

// M3 Linear progress – qty visual
export const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.surfaceContainerHighest};
  border-radius: ${theme.shape.full};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.max(0, Math.min(100, $pct))}%;
  background: ${theme.colors.primary};
  transition: width 0.2s;
`;

export const PublisherRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const PublisherAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${theme.shape.full};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

// M3 Filled Button (primary action)
export const PrimaryButton = styled.button`
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

// M3 Outlined Button (destructive)
export const DangerOutlineButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.full};
  color: ${theme.colors.error};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: ${theme.colors.errorContainer}; }
  &:disabled { color: rgba(26,28,30,0.38); border-color: rgba(26,28,30,0.12); cursor: not-allowed; }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.titleMedium.fontSize};
  font-weight: ${theme.typography.titleMedium.fontWeight};
  color: ${theme.colors.onSurface};
`;

export const ProposalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ProposalCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  align-items: stretch;
  gap: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

export const ProposalInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  justify-content: center;
`;

export const ProposalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

export const ProposalTitle = styled.p`
  margin: 0;
  font-weight: 500;
  color: ${theme.colors.onSurface};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

export const ProposalDetail = styled.p`
  margin: 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// Vertical divider between info and actions (collapses to horizontal on mobile)
export const VerticalDivider = styled.div`
  width: 1px;
  background: ${theme.colors.outlineVariant};
  align-self: stretch;

  @media (max-width: 480px) {
    width: 100%;
    height: 1px;
  }
`;

// M3 Assist Chip — más liviano que un button (peso visual menor)
export const ProposalStatusBadge = styled.span<{ $status: ProposalStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: 400;
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'PENDIENTE' ? theme.colors.tertiaryContainer :
    $status === 'ACEPTADA'  ? theme.colors.successContainer :
                               theme.colors.errorContainer};
  color: ${({ $status }) =>
    $status === 'PENDIENTE' ? theme.colors.onTertiaryContainer :
    $status === 'ACEPTADA'  ? theme.colors.success :
                               theme.colors.onErrorContainer};
`;

// Botones apilados verticalmente — jerarquía clara: acciones primarias
export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  justify-content: center;
  min-width: 120px;
`;

export const AcceptButton = styled.button`
  padding: 6px 16px;
  background: ${theme.colors.successContainer};
  color: ${theme.colors.success};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const RejectButton = styled.button`
  padding: 6px 16px;
  background: ${theme.colors.errorContainer};
  color: ${theme.colors.onErrorContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;
