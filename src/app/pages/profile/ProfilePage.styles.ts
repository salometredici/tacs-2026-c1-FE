import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const ProfileHeader = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
`;

export const ProfileTitle = styled.h1`
  color: ${theme.colors.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

export const ProfileEmail = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

export const TabSection = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
`;

export const TabNav = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 2px solid ${theme.colors.border};
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  background: ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : theme.colors.textSecondary};
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? theme.colors.primary : theme.colors.border};
  }
`;
