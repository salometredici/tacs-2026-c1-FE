import styled from 'styled-components';
import { EstadoPropuesta } from '../../interfaces/proposals/Propuesta';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
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
  color: ${theme.colors.primary};
  padding: 0;
  line-height: 1;
  &:hover { opacity: 0.7; }
`;

export const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  margin: 0;
`;

export const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};
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

export const ProposalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ProposalCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border-left: 4px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.lg};
`;

export const ProposalInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const ProposalTitle = styled.p`
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
  font-size: 1rem;
`;

export const ProposalDetail = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-size: 0.875rem;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;
`;

export const StatusBadge = styled.span<{ $estado: EstadoPropuesta }>`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
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

export const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const AcceptButton = styled.button`
  padding: 0.3rem 0.8rem;
  background: ${theme.colors.success};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover:not(:disabled) { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const RejectButton = styled.button`
  padding: 0.3rem 0.8rem;
  background: none;
  color: ${theme.colors.danger};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) { background: ${theme.colors.danger}; color: white; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xl};
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
  text-align: center;
  margin: ${theme.spacing.sm} 0 0;
`;
