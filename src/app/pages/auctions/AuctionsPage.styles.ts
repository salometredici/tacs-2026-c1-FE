import styled from 'styled-components';
import { theme } from '../../styles/theme';

// M3 Tab Row
export const TabNav = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  margin-bottom: ${theme.spacing.xl};
`;

// M3 Secondary Tab
export const TabBtn = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -1px;
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.onSurfaceVariant)};
  cursor: pointer;
  transition: color 0.15s;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.00625em;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover {
    color: ${theme.colors.primary};
    &::after { opacity: ${theme.state.hover}; }
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.bodySmall.fontSize};
  }
`;

// M3 Elevated Card (My Bids)
export const MyBidCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${theme.elevation[2]};
    &::after { opacity: ${theme.state.hover}; }
  }
`;

// M3 Assist Chip – status
export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  background: ${({ $status }) =>
    $status === 'ACTIVA'   ? theme.colors.primaryContainer :
    $status === 'GANADORA' ? theme.colors.successContainer :
    $status === 'SUPERADA' ? theme.colors.tertiaryContainer :
                              theme.colors.errorContainer};
  color: ${({ $status }) =>
    $status === 'ACTIVA'   ? theme.colors.onPrimaryContainer :
    $status === 'GANADORA' ? theme.colors.success :
    $status === 'SUPERADA' ? theme.colors.onTertiaryContainer :
                              theme.colors.onErrorContainer};
`;
