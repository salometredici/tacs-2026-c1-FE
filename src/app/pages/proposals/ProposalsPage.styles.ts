import styled from 'styled-components';
import { theme } from '../../styles/theme';
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
  margin-bottom: ${theme.spacing.xl};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.onSurfaceVariant};
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

export const Title = styled.h1`
  color: ${theme.colors.onBackground};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  margin: 0;
`;

// M3 Secondary Tabs
export const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  margin-bottom: ${theme.spacing.xl};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -1px;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.onSurfaceVariant)};
  cursor: pointer;
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  letter-spacing: 0.00625em;
  transition: color 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover { color: ${theme.colors.primary}; &::after { opacity: ${theme.state.hover}; } }
`;

export const ProposalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

// M3 Elevated Card
export const ProposalCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

export const ProposalInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const ProposalTitle = styled.p`
  font-weight: 500;
  color: ${theme.colors.onSurface};
  margin: 0;
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

export const ProposalDetail = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

// M3 Assist Chip – proposal status
export const StatusBadge = styled.span<{ $estado: ProposalStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: ${({ $estado }) =>
    $estado === 'PENDIENTE' ? theme.colors.tertiaryContainer :
    $estado === 'ACEPTADA'  ? theme.colors.successContainer :
                               theme.colors.errorContainer};
  color: ${({ $estado }) =>
    $estado === 'PENDIENTE' ? theme.colors.onTertiaryContainer :
    $estado === 'ACEPTADA'  ? theme.colors.success :
                               theme.colors.onErrorContainer};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

// M3 Filled Tonal Button (accept)
export const AcceptButton = styled.button`
  padding: 6px 16px;
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
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
  &:disabled { opacity: 0.38; pointer-events: none; }
`;

// M3 Outlined Button (reject)
export const RejectButton = styled.button`
  padding: 6px 16px;
  background: none;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.error};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
  &:disabled { opacity: 0.38; pointer-events: none; }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  padding: ${theme.spacing.xl};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

// M3 Text Button — link a la publi relacionada
export const ViewPublicationLink = styled.button`
  align-self: flex-start;
  margin-top: ${theme.spacing.xs};
  padding: 4px 8px;
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  cursor: pointer;
  border-radius: ${theme.shape.small};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  &:hover { text-decoration: underline; }
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.bodySmall.fontSize};
  text-align: center;
  margin: ${theme.spacing.sm} 0 0;
  background: ${theme.colors.errorContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
`;
