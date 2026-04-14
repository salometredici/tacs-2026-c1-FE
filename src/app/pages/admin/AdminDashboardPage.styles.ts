import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const DashboardContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
`;

export const DashboardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
`;

export const DashboardTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin: 0;
`;

export const DashboardSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0;
`;

export const LogoutButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.danger};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 ${theme.spacing.md};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${theme.spacing.md};
`;

export const StatCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const StatIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
  margin-bottom: ${theme.spacing.xs};
`;

export const StatValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.3;
`;
