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
