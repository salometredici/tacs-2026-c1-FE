import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: contents;
`;

export const SearchTitle = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
  font-size: 2rem;
`;

export const FilterSection = styled.div`
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${props =>
    props.variant === 'secondary' ? theme.colors.border : theme.colors.primary};
  color: ${props => (props.variant === 'secondary' ? theme.colors.text : 'white')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ResultsContainer = styled.div`
  margin-top: ${theme.spacing.xl};
`;

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border};
`;

export const ResultCount = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin: 0;
`;

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const FiguritaCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }
`;

export const FiguritaNumber = styled.h3`
  margin: 0 0 ${theme.spacing.md} 0;
  color: ${theme.colors.primary};
  font-size: 1.5rem;
`;

export const FiguritaInfo = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;

  strong {
    color: ${theme.colors.text};
  }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  padding: ${theme.spacing.xl};
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  padding: ${theme.spacing.xl};
`;
