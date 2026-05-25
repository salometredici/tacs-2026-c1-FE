import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const PageTitle = styled.h1`
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  color: ${theme.colors.onBackground};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: ${theme.typography.bodyLarge.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
`;

// M3 Outlined Text Field — local search input
export const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  box-sizing: border-box;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }
  &:focus { border: 2px solid ${theme.colors.primary}; }
  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

// M3 Filled Tonal Button — filter chips
export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: ${theme.shape.full};
  border: 1px solid ${({ $active }) =>
    $active ? 'transparent' : theme.colors.outlineVariant};
  background: ${({ $active }) =>
    $active ? theme.colors.secondaryContainer : 'transparent'};
  color: ${({ $active }) =>
    $active ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
  &:active::after { opacity: ${theme.state.pressed}; }
`;

export const ResultMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
`;

export const ResultCount = styled.p`
  font-size: ${theme.typography.bodyLarge.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 240px));
  gap: ${theme.spacing.lg};
  justify-content: center;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 240px));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

// M3 Elevated Card
export const CardItem = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  &:hover {
    box-shadow: ${theme.elevation[2]};
  }
`;

// Banner visual al tope de la card — color de fondo según categoría + ícono de figurita
export const CardThumbnail = styled.div<{ $category: string }>`
  width: 100%;
  height: 96px;
  border-radius: ${theme.shape.small};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.sm};
  background: ${({ $category }) => {
    if ($category === 'LEGENDARIO') return theme.colors.tertiaryContainer;
    if ($category === 'EPICO') return theme.colors.primaryContainer;
    return theme.colors.surfaceContainerHighest;
  }};
  color: ${({ $category }) => {
    if ($category === 'LEGENDARIO') return theme.colors.onTertiaryContainer;
    if ($category === 'EPICO') return theme.colors.onPrimaryContainer;
    return theme.colors.onSurfaceVariant;
  }};

  & .material-symbols-outlined { font-size: 48px; }
`;

export const CardNumber = styled.span`
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 500;
  color: ${theme.colors.primary};
`;

export const CardDescription = styled.p`
  font-size: ${theme.typography.bodyLarge.fontSize};
  font-weight: 500;
  color: ${theme.colors.onSurface};
  margin: 0;
`;

export const CardMeta = styled.p`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  margin: 0;
`;

// M3 Assist Chip used as category badge
export const CategoryBadge = styled.span<{ $category: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  align-self: flex-start;
  margin-top: auto;

  background: ${({ $category }) => {
    if ($category === 'LEGENDARIO') return theme.colors.tertiaryContainer;
    if ($category === 'EPICO') return theme.colors.primaryContainer;
    return theme.colors.surfaceContainerHighest;
  }};

  color: ${({ $category }) => {
    if ($category === 'LEGENDARIO') return theme.colors.onTertiaryContainer;
    if ($category === 'EPICO') return theme.colors.onPrimaryContainer;
    return theme.colors.onSurfaceVariant;
  }};
`;

// ─── M3 Pagination ────────────────────────────────────────────────────────────

export const PaginationRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md} 0;
`;

export const PaginationIconButton = styled.button<{ disabled?: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${theme.shape.full};
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) =>
    disabled ? theme.colors.onSurface : theme.colors.onSurfaceVariant};
  opacity: ${({ disabled }) => (disabled ? theme.state.disabled : '1')};
  transition: background-color 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:not(:disabled):hover::after { opacity: ${theme.state.hover}; }
  &:not(:disabled):active::after { opacity: ${theme.state.pressed}; }
`;

export const PageButton = styled.button<{ $current: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 0 4px;
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${({ $current }) => ($current ? 700 : 400)};
  cursor: ${({ $current }) => ($current ? 'default' : 'pointer')};
  background: ${({ $current }) =>
    $current ? theme.colors.primary : 'none'};
  color: ${({ $current }) =>
    $current ? theme.colors.onPrimary : theme.colors.onSurfaceVariant};
  transition: background-color 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:not([data-current='true']):hover::after { opacity: ${theme.state.hover}; }
`;

export const PageEllipsis = styled.span`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.bodyLarge.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  user-select: none;
`;

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
`;
