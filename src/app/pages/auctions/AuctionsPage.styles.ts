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

// Row "header" de una bid card: título + status badge
export const MyBidHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MyBidTitle = styled.strong`
  font-size: 1.1rem;
`;

export const MyBidMeta = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};

  & + & { margin-top: 0; }
`;

export const MyBidSubMeta = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

export const StrongInline = styled.strong`
  color: ${theme.colors.text};
`;

// M3 Outlined Button con color de error — usado para "Cancelar oferta"
export const CancelBidButton = styled.button`
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.35rem 0.85rem;
  background: transparent;
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.full};
  color: ${theme.colors.error};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;

  &:disabled { cursor: wait; }
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
