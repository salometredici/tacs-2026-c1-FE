import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const Title = styled.h1`
  color: ${theme.colors.onBackground};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.headlineMedium.fontSize};
  line-height: ${theme.typography.headlineMedium.lineHeight};
  font-weight: 400;
`;

export const Subtitle = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
  margin-bottom: ${theme.spacing.xl};
`;

// M3 Elevated Cards grid
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const Card = styled.button`
  background: ${theme.colors.surfaceContainerLow};
  border: none;
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: ${theme.elevation[1]};
  text-align: left;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover {
    box-shadow: ${theme.elevation[2]};
    &::after { opacity: ${theme.state.hover}; }
  }

  &:active::after { opacity: ${theme.state.pressed}; }
`;

export const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border-radius: ${theme.shape.medium};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;

  & .material-symbols-outlined { font-size: 28px; }
`;

export const CardTitle = styled.h2`
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.titleLarge.fontSize};
  line-height: ${theme.typography.titleLarge.lineHeight};
  font-weight: 500;
`;

export const CardDescription = styled.p`
  margin: 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
  line-height: 1.5;
`;

// M3 Filled Card — wrapper compartido para secciones del home (sugerencias, catálogo, etc.)
export const SuggestionsSection = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
`;

// Catálogo embebido usa el mismo wrapper que sugerencias
export const CatalogSection = SuggestionsSection;

// Header con icono + título — mismo peso visual que las CardTitle de navegación
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin: 0 0 ${theme.spacing.lg} 0;
`;

export const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border-radius: ${theme.shape.small};
  display: flex;
  align-items: center;
  justify-content: center;

  & .material-symbols-outlined { font-size: 22px; }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.titleLarge.fontSize};
  line-height: ${theme.typography.titleLarge.lineHeight};
  font-weight: 500;
`;

// Aliases legacy
export const CatalogSectionTitle = SectionTitle;
export const SuggestionsTitle = SectionTitle;

export const CatalogSectionSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.lg} 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// Thumbnail más chico que las suggestion cards (no muestra player; muestra ícono según categoría)
export const CatalogPreviewThumbnail = styled.div<{ $category: string }>`
  width: 100%;
  height: 64px;
  border-radius: ${theme.shape.small};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.tertiaryContainer :
    $category === 'EPICO'      ? theme.colors.primaryContainer :
                                  theme.colors.surfaceContainerHighest};
  color: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.onTertiaryContainer :
    $category === 'EPICO'      ? theme.colors.onPrimaryContainer :
                                  theme.colors.onSurfaceVariant};

  & .material-symbols-outlined { font-size: 32px; }
`;

// CTA al final del catálogo — M3 Filled Tonal Button (más peso que un text link)
export const CatalogViewAllLink = styled.button`
  margin-top: ${theme.spacing.lg};
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  padding: 10px 20px 10px 24px;
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSecondaryContainer};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover {
    box-shadow: ${theme.elevation[1]};
    &::after { opacity: ${theme.state.hover}; }
  }

  &:active::after { opacity: ${theme.state.pressed}; }

  & .material-symbols-outlined { font-size: 18px; }
`;

export const CarouselWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const CarouselArrow = styled.button<{ $side: 'left' | 'right' }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: ${theme.shape.full};
  border: 1px solid ${theme.colors.outlineVariant};
  background: ${theme.colors.surfaceContainerHigh};
  color: ${theme.colors.onSurface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.15s, background 0.15s;
  z-index: 1;

  &:hover { background: ${theme.colors.surfaceContainerHighest}; box-shadow: ${theme.elevation[1]}; }

  & .material-symbols-outlined { font-size: 20px; }
`;

export const SuggestionsCarousel = styled.div`
  display: flex;
  flex: 1;
  gap: ${theme.spacing.md};
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  cursor: grab;
  user-select: none;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
  &.dragging { cursor: grabbing; scroll-behavior: auto; }
`;

// M3 Outlined Card (suggestion chip)
export const SuggestionCard = styled.button`
  flex-shrink: 0;
  width: 180px;
  background: ${theme.colors.surface};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.outlineVariant};
  cursor: pointer;
  text-align: left;
  scroll-snap-align: start;
  transition: box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.elevation[1]};
    &::after { opacity: ${theme.state.hover}; }
  }
`;

// M3 Assist Chip – category
export const CategoryBadge = styled.span<{ $category: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  letter-spacing: 0.04em;
  align-self: flex-start;
  background: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.tertiaryContainer :
    $category === 'EPICO'      ? theme.colors.primaryContainer :
                                  theme.colors.surfaceContainerHighest};
  color: ${({ $category }) =>
    $category === 'LEGENDARIO' ? theme.colors.onTertiaryContainer :
    $category === 'EPICO'      ? theme.colors.onPrimaryContainer :
                                  theme.colors.onSurfaceVariant};
`;

export const CardNumber = styled.span`
  font-size: ${theme.typography.titleLarge.fontSize};
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
`;

export const CardPlayer = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  font-weight: 500;
  color: ${theme.colors.onSurface};
`;

export const CardMeta = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  flex: 1;
`;

export const CardOwner = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  font-style: italic;
`;

export const EmptyMessage = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
  margin: 0;
`;
