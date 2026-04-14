import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const NavbarContainer = styled.nav`
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.shadows.md};
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const BrandTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const BellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: ${theme.colors.danger};
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  pointer-events: none;
`;

export const NotificationsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  z-index: 2000;
  overflow: hidden;
`;

export const NotificationItem = styled.div<{ $read: boolean }>`
  padding: ${theme.spacing.md};
  font-size: 0.875rem;
  color: ${theme.colors.text};
  border-bottom: 1px solid ${theme.colors.border};
  background: ${({ $read }) => ($read ? 'transparent' : '#e3f2fd')};

  &:last-child {
    border-bottom: none;
  }
`;

export const EmptyNotification = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
`;
