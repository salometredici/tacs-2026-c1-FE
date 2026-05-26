import styled from 'styled-components';
import { theme } from '../../styles/theme';

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

export const ProfileAvatar = styled.img`
  width: 48px;
  height: 48px;
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

export const ProfileMeta = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  margin: ${theme.spacing.xs} 0 0 0;
  font-size: ${theme.typography.bodySmall.fontSize};
`;

export const ProfileMetaStar = styled.span`
  color: ${theme.colors.tertiary};
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

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.outlineVariant};
  margin: ${theme.spacing.lg} 0;
`;

// M3 List Item – fila clickable de una sola línea (genérica)
export const ListItemCard = styled.div`
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

// M3 List Item (Outlined) – fila clickable con headline + supporting text. Genérico, reusable entre tabs.
export const OutlinedListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.medium};
  cursor: pointer;
  gap: ${theme.spacing.md};
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s;

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

  &:hover {
    border-color: ${theme.colors.outline};
    &::after { opacity: ${theme.state.hover}; }
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
    flex: 1;
    min-width: 0;
  }

  & > div > strong {
    font-size: ${theme.typography.bodyLarge.fontSize};
    font-weight: 500;
    color: ${theme.colors.onSurface};
  }

  & > div > span {
    font-size: ${theme.typography.bodyMedium.fontSize};
    color: ${theme.colors.onSurfaceVariant};
  }
`;

// M3 Outlined Button (compact) – marca una figurita faltante como conseguida
export const MarkAsAcquiredButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: transparent;
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.full};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover {
    border-color: ${theme.colors.primary};
    &::after { opacity: ${theme.state.hover}; }
  }

  & .material-symbols-outlined {
    font-size: 18px;
  }
`;

