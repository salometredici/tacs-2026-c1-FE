import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  align-items: center;
`;

export const ProfileTitle = styled.h1`
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

export const ProfileEmail = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

export const TabSection = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
`;

export const TabNav = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  background: ${({ $active }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => $active ? theme.colors.primary : theme.colors.border};
  }
`;

export const AddButton = styled.button`
  padding: ${theme.spacing.sm} 1.25rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1565c0; }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${theme.colors.text};
`;

export const SeeAllLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

export const RowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ProposalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border-left: 3px solid ${theme.colors.border};
  gap: ${theme.spacing.md};
`;

export const ProposalText = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.text};
  flex: 1;
`;

export const StatusBadge = styled.span<{ $estado: ProposalStatus }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $estado }) =>
    $estado === 'PENDIENTE' ? '#fff8e1' :
    $estado === 'ACEPTADA'  ? '#e8f5e9' :
    '#fce4ec'};
  color: ${({ $estado }) =>
    $estado === 'PENDIENTE' ? '#f57c00' :
    $estado === 'ACEPTADA'  ? '#388e3c' :
    '#d32f2f'};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: ${theme.spacing.lg} 0;
`;

export const CompactAuctionCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: background 0.15s;
  gap: ${theme.spacing.md};
  &:hover { background: ${theme.colors.border}; }
`;

export const AuctionText = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.text};
  flex: 1;
`;

export const AuctionStatus = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? theme.colors.success : theme.colors.textSecondary};
`;
