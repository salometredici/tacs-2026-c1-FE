import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

// M3 Elevated Card – profile header
export const ProfileHeader = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.shape.medium};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProfileTitle = styled.h1`
  color: ${theme.colors.onSurface};
  margin: 0 0 ${theme.spacing.xs} 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
`;

export const ProfileEmail = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// M3 Elevated Card – tab section
export const TabSection = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
`;

// M3 Secondary Tab Row
export const TabNav = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
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

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.bodySmall.fontSize};
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  gap: ${theme.spacing.md};
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: ${theme.typography.titleSmall.fontWeight};
  color: ${theme.colors.onSurface};
`;

// M3 Text Button
export const SeeAllLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.shape.full};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

export const RowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

// M3 List Item style
export const ProposalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surfaceContainerLowest};
  border-radius: ${theme.shape.small};
  gap: ${theme.spacing.md};
`;

export const ProposalText = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurface};
  flex: 1;
`;

// M3 Assist Chip
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

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.outlineVariant};
  margin: ${theme.spacing.lg} 0;
`;

export const CompactAuctionCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surfaceContainerLowest};
  border-radius: ${theme.shape.small};
  cursor: pointer;
  transition: background 0.15s;
  gap: ${theme.spacing.md};
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
    pointer-events: none;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

export const AuctionText = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurface};
  flex: 1;
`;

export const AuctionStatus = styled.span<{ $active: boolean }>`
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  color: ${({ $active }) => $active ? theme.colors.success : theme.colors.onSurfaceVariant};
`;
