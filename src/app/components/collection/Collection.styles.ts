import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const CollectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const FiguritaCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  text-align: center;
  border: 2px solid ${theme.colors.border};
  transition: border-color 0.2s;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  h4 {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.primary};
  }

  p {
    margin: 0.25rem 0;
    color: ${theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

export const TabButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: 2px solid ${props => props.active ? theme.colors.primary : theme.colors.border};
  background: ${props => props.active ? theme.colors.primary : theme.colors.surface};
  color: ${props => props.active ? 'white' : theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  padding: ${theme.spacing.xl};
`;
