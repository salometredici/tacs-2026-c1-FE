import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const CollectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${theme.spacing.md};
`;

// M3 Elevated Card
export const CardItem = styled.div`
  position: relative;
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.md};
  text-align: center;
  box-shadow: ${theme.elevation[1]};
  transition: box-shadow 0.2s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${theme.elevation[2]};
    &::after { opacity: ${theme.state.hover}; }
  }

  h4 {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.primary};
    font-size: ${theme.typography.titleSmall.fontSize};
    font-weight: ${theme.typography.titleSmall.fontWeight};
  }

  p {
    margin: ${theme.spacing.xs} 0;
    color: ${theme.colors.onSurfaceVariant};
    font-size: ${theme.typography.bodySmall.fontSize};
  }
`;

// Banner visual al tope de la card — usa imageUrl si existe, sino icono según categoría
export const CardImage = styled.div<{ $imageUrl?: string; $category: string }>`
  width: 100%;
  height: 80px;
  border-radius: ${theme.shape.small};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.tertiaryContainer :
    $category === 'EPICO'      ? theme.colors.primaryContainer :
                                  theme.colors.surfaceContainerHighest};
  color: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.onTertiaryContainer :
    $category === 'EPICO'      ? theme.colors.onPrimaryContainer :
                                  theme.colors.onSurfaceVariant};
  background-image: ${({ $imageUrl }) => $imageUrl ? `url(${$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  overflow: hidden;

  & .material-symbols-outlined {
    font-size: 40px;
  }
`;

export const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

// Completitud del álbum (figuritas distintas / total del catálogo), bajo el botón de agregar
export const CompletionLabel = styled.p`
  margin: 0 0 ${theme.spacing.md} 0;
  text-align: right;
  color: ${theme.colors.primary};
  font-weight: 700;
  font-size: ${theme.typography.titleSmall.fontSize};
`;

export const TabButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

// M3 Filter Chip
export const TabButton = styled.button<{ active: boolean }>`
  padding: 6px 16px;
  border: 1px solid ${props => props.active ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${props => props.active ? theme.colors.secondaryContainer : theme.colors.surface};
  color: ${props => props.active ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant};
  border-radius: ${theme.shape.small};
  cursor: pointer;
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.04em;
  transition: all 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.active ? theme.colors.onSecondaryContainer : theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover { border-color: ${theme.colors.primary}; &::after { opacity: ${theme.state.hover}; } }
`;
