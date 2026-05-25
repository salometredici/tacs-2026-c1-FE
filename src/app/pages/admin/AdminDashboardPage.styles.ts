import styled from 'styled-components';
import { theme } from '../../styles/theme';

// Wrapper externo full-width (sin max-width) para que la top bar ocupe todo el ancho
export const DashboardOuter = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

// M3 Top App Bar — Small variant, consistente con el Navbar del user layout
export const DashboardHeaderBar = styled.header`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  height: 64px;
  padding: 0 ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.elevation[2]};

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const HeaderIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.onPrimary};

  & .material-symbols-outlined { font-size: 26px; }
`;

export const DashboardTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.titleLarge.fontSize};
  line-height: ${theme.typography.titleLarge.lineHeight};
  font-weight: 500;
  color: ${theme.colors.onPrimary};
`;

// M3 Outlined Button sobre fondo primary
export const LogoutButton = styled.button`
  padding: 8px ${theme.spacing.lg};
  background: transparent;
  color: ${theme.colors.onPrimary};
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, border-color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: rgba(255, 255, 255, ${theme.state.hover});
    border-color: ${theme.colors.onPrimary};
  }

  &:active { background: rgba(255, 255, 255, ${theme.state.pressed}); }

  & .material-symbols-outlined { font-size: 18px; }
`;

// Contenido principal centrado debajo de la top bar
export const DashboardContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const DashboardSubtitle = styled.p`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  margin: 0 0 ${theme.spacing.lg};
`;

// Banner sutil para indicar estado WIP (datos mockeados, integración pendiente con BE)
export const WipNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  background: ${theme.colors.tertiaryContainer};
  color: ${theme.colors.onTertiaryContainer};
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.bodySmall.fontSize};

  & .material-symbols-outlined { font-size: 18px; }
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

// M3 Filled Card (tonal) con hover de elevación suave
export const StatCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  box-shadow: ${theme.elevation[1]};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${theme.elevation[2]};
    transform: translateY(-2px);
  }
`;

// Icono dentro de un círculo tonal para más jerarquía visual
export const StatIcon = styled.span`
  width: 44px;
  height: 44px;
  border-radius: ${theme.shape.full};
  background: ${theme.colors.primaryContainer};
  color: ${theme.colors.onPrimaryContainer};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & .material-symbols-outlined { font-size: 24px; }
`;

export const StatValue = styled.span`
  font-size: ${theme.typography.displaySmall.fontSize};
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  line-height: 1.3;
`;
