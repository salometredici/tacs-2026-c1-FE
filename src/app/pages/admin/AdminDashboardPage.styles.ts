import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const DashboardContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const DashboardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  gap: ${theme.spacing.md};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const DashboardTitle = styled.h1`
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  color: ${theme.colors.onBackground};
  margin: 0;
`;

export const DashboardSubtitle = styled.p`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  margin: ${theme.spacing.xs} 0 0;
`;

// M3 Filled Tonal Button (logout)
export const LogoutButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background-color: ${theme.colors.errorContainer};
  color: ${theme.colors.onErrorContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  white-space: nowrap;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onErrorContainer};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 ${theme.spacing.md};
`;

// M3 responsive grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${theme.spacing.md};
`;

// M3 Filled Card (tonal)
export const StatCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  box-shadow: ${theme.elevation[1]};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${theme.elevation[2]}; }
`;

export const StatIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
  margin-bottom: ${theme.spacing.xs};
`;

export const StatValue = styled.span`
  font-size: ${theme.typography.displaySmall.fontSize};
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  line-height: 1.3;
`;
