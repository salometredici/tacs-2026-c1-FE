import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  font-size: 0.95rem;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { color: ${theme.colors.primary}; }
`;

export const MyBidCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === 'ACTIVA'   ? '#e3f2fd' :
    $status === 'GANADORA' ? '#e8f5e9' :
    $status === 'SUPERADA' ? '#fff3e0' : '#fce4ec'};
  color: ${({ $status }) =>
    $status === 'ACTIVA'   ? '#1565c0' :
    $status === 'GANADORA' ? '#2e7d32' :
    $status === 'SUPERADA' ? '#e65100' : '#b71c1c'};
`;
