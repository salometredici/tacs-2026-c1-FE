import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const Title = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
  font-size: 2.5rem;
`;

export const Subtitle = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-bottom: ${theme.spacing.xl};
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.xl};
`;

export const Card = styled.button`
  background: ${theme.colors.surface};
  border: 2px solid transparent;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${theme.shadows.sm};
  text-align: left;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.primary};
  }
`;

export const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const CardTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.primary};
  font-size: 1.3rem;
`;

export const CardDescription = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const SugerenciasSection = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
`;

export const SugerenciasTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.secondary};
`;

export const SugerenciasCarousel = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  overflow-x: scroll;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-bottom: ${theme.spacing.sm};
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.border} transparent;

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 2px;
  }
`;

export const SugerenciaCard = styled.button`
  flex-shrink: 0;
  width: 180px;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  text-align: left;
  scroll-snap-align: start;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }
`;

export const CategoriaBadge = styled.span<{ $categoria: string }>`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  align-self: flex-start;
  background: ${({ $categoria }) =>
    $categoria === 'LEGENDARIO' ? '#fff8e1' :
    $categoria === 'EPICO'      ? '#e3f2fd' :
                                  '#f5f5f5'};
  color: ${({ $categoria }) =>
    $categoria === 'LEGENDARIO' ? '#f57c00' :
    $categoria === 'EPICO'      ? '#1976d2' :
                                  '#666666'};
`;

export const CardNumber = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
`;

export const CardPlayer = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const CardMeta = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
  flex: 1;
`;

export const CardOwner = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

export const EmptyMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;
