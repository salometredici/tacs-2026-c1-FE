import styled from 'styled-components';
import { theme } from '../../styles/theme';

// M3 Top App Bar – Small variant (primary container variant)
export const NavbarContainer = styled.nav`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  padding: 0 ${theme.spacing.md};
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.elevation[2]};

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const BrandTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.titleLarge.fontSize};
  line-height: ${theme.typography.titleLarge.lineHeight};
  font-weight: 500;
  color: ${theme.colors.onPrimary};
  cursor: pointer;
  user-select: none;

  @media (max-width: 480px) {
    font-size: ${theme.typography.titleMedium.fontSize};
  }
`;

// Logo/marca a la izquierda del título
export const BrandIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.onPrimary};
  cursor: pointer;
  user-select: none;

  & .material-symbols-outlined { font-size: 28px; }
`;

// Nav links agrupados a la izquierda, después del brand
export const NavLinksSection = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
  margin-left: ${theme.spacing.lg};

  @media (max-width: 600px) {
    display: none;
  }
`;

export const NavTextLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.onPrimary};
  cursor: pointer;
  height: 100%;
  padding: 0 ${theme.spacing.lg};
  border-radius: 0;
  display: flex;
  align-items: center;
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  transition: background-color 0.15s, color 0.15s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.15s;
  }

  &[aria-current='page'] {
    font-weight: 600;
    &::after { opacity: ${theme.state.hover}; }
  }

  &:hover {
    &::after { opacity: ${theme.state.hover}; }
  }

  &:active::after { opacity: ${theme.state.pressed}; }
`;

export const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-left: auto;

  @media (max-width: 480px) {
    gap: 0;
  }
`;

// M3 Icon Button (on primary surface)
export const NavButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.onPrimary};
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;

  & .material-symbols-outlined {
    font-size: 22px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, ${theme.state.hover});
  }

  &:active {
    background-color: rgba(255, 255, 255, ${theme.state.pressed});
  }
`;

export const BellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// M3 Badge
export const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: ${theme.colors.error};
  color: ${theme.colors.onError};
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: ${theme.shape.full};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  pointer-events: none;
  letter-spacing: 0;
`;

// M3 Menu (dropdown)
export const NotificationsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 300px;
  background: ${theme.colors.surfaceContainerLow};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[3]};
  z-index: 2000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 280px;
    right: -8px;
  }
`;

export const NotificationItem = styled.div<{ $read: boolean }>`
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.bodyMedium.fontSize};
  line-height: ${theme.typography.bodyMedium.lineHeight};
  color: ${theme.colors.onSurface};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  background: ${({ $read }) =>
    $read ? 'transparent' : theme.colors.secondaryContainer};
  cursor: pointer;
  transition: filter 0.15s;

  &:hover { filter: brightness(0.96); }
  &:last-child { border-bottom: none; }
`;

export const EmptyNotification = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// M3 Text Button — link a la página de notificaciones
export const ViewAllLink = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: none;
  border: none;
  border-top: 1px solid ${theme.colors.outlineVariant};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background-color 0.15s;
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

  &:hover::after { opacity: ${theme.state.hover}; }

  & .material-symbols-outlined { font-size: 1rem; }
`;
