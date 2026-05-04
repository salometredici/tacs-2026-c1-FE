import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.onBackground};
  font-size: ${theme.typography.headlineMedium.fontSize};
  line-height: ${theme.typography.headlineMedium.lineHeight};
  font-weight: 400;
  margin: 0 0 ${theme.spacing.lg};
`;

// 2-column on desktop (figurita info + condiciones), stacked on smaller screens
export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  & > div { margin-bottom: 0; }
`;

// M3 Text Button con leading icon
export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  transition: background-color 0.15s;

  & .material-symbols-outlined { font-size: 20px; }

  &:hover { background: rgba(75, 45, 127, ${theme.state.hover}); }
`;

export const Card = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.elevation[1]};
  margin-bottom: ${theme.spacing.lg};
`;

export const FiguritaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  padding-bottom: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

export const FiguritaNumero = styled.div`
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 600;
  color: ${theme.colors.primary};
  min-width: 48px;
  text-align: center;
`;

export const FiguritaInfo = styled.div`
  flex: 1;
  h2 {
    margin: 0 0 0.1rem;
    font-size: ${theme.typography.titleMedium.fontSize};
    font-weight: 500;
  }
  p {
    margin: 0;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.onSurfaceVariant};
  }
`;

export const CategoriaBadge = styled.span<{ $cat: string }>`
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ $cat }) =>
    $cat === 'LEGENDARIO' ? '#fff3e0' :
    $cat === 'EPICO' ? '#e3f2fd' : '#f5f5f5'};
  color: ${({ $cat }) =>
    $cat === 'LEGENDARIO' ? '#e65100' :
    $cat === 'EPICO' ? '#1565c0' : '#555'};
`;

export const EstadoBadge = styled.span<{ $estado: string }>`
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  background: ${({ $estado }) =>
    $estado === 'ACTIVA' ? '#e8f5e9' :
    $estado === 'FINALIZADA' ? '#e3f2fd' :
    $estado === 'DESIERTA' ? '#f5f5f5' : '#fce4ec'};
  color: ${({ $estado }) =>
    $estado === 'ACTIVA' ? '#2e7d32' :
    $estado === 'FINALIZADA' ? '#1565c0' :
    $estado === 'DESIERTA' ? '#555' : '#b71c1c'};
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.typography.titleSmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${theme.spacing.sm};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xs} 0;
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  font-size: ${theme.typography.bodySmall.fontSize};
  &:last-child { border-bottom: none; }
  .label { color: ${theme.colors.onSurfaceVariant}; }
  .value { font-weight: 500; color: ${theme.colors.onSurface}; }
`;

export const ReglaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} 0;
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurface};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  &:last-child { border-bottom: none; }
  &::before { content: '•'; color: ${theme.colors.primary}; font-size: 1.1rem; }
`;

// Grid de bid cards (estilo sugerencias del home)
export const OfertasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${theme.spacing.md};
`;

// Bid card compacta — outlined card M3
export const OfertaCard = styled.div<{ $estado: string }>`
  position: relative;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.outlineVariant};
  border-left: 4px solid ${({ $estado }) =>
    $estado === 'GANADORA' ? theme.colors.success :
    $estado === 'ACTIVA' ? theme.colors.primary :
    $estado === 'SUPERADA' ? theme.colors.warning : theme.colors.outline};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${theme.elevation[1]}; }
`;

export const OfertaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
`;

export const OfertaBidder = styled.div`
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: 600;
  color: ${theme.colors.onSurface};
  line-height: 1.2;
`;

export const OfertaRating = styled.div`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.tertiary};
  margin-top: 2px;

  & .num {
    color: ${theme.colors.onSurfaceVariant};
    margin-left: ${theme.spacing.xs};
  }
`;

export const OfertaFiguritas = styled.div`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  line-height: 1.4;

  & strong { color: ${theme.colors.onSurface}; font-weight: 500; }
`;

export const OfertaDate = styled.div`
  font-size: ${theme.typography.labelSmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

// Pequeño botón Filled Tonal para "Elegir ganadora"
export const ChooseWinnerButton = styled.button`
  align-self: flex-start;
  padding: 6px ${theme.spacing.md};
  background: ${theme.colors.primaryContainer};
  color: ${theme.colors.onPrimaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.15s;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimaryContainer};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:disabled { opacity: ${theme.state.disabled}; cursor: not-allowed; box-shadow: none; }
`;


export const OfertaEstadoBadge = styled.span<{ $estado: string }>`
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $estado }) =>
    $estado === 'GANADORA' ? '#e8f5e9' :
    $estado === 'ACTIVA' ? '#e3f2fd' :
    $estado === 'SUPERADA' ? '#fff3e0' : '#f5f5f5'};
  color: ${({ $estado }) =>
    $estado === 'GANADORA' ? '#2e7d32' :
    $estado === 'ACTIVA' ? '#1565c0' :
    $estado === 'SUPERADA' ? '#e65100' : '#555'};
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ConfirmModal = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  max-width: 480px;
  width: 90%;
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${theme.colors.text};
`;

export const WarningBox = styled.div`
  background: #fff3e0;
  border-left: 4px solid ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  font-size: 0.9rem;
  color: #e65100;
`;

export const ExchangeSummary = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  .label { color: ${theme.colors.textSecondary}; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .value { font-weight: 600; color: ${theme.colors.text}; }
`;

export const ConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

export const CancelBtn = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  &:hover { background: ${theme.colors.background}; }
`;

export const ConfirmBtn = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.danger};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #b71c1c; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const BidButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: ${theme.spacing.md};
  &:hover { background: #1565c0; transform: translateY(-2px); box-shadow: ${theme.shadows.md}; }
  &:disabled { background: ${theme.colors.border}; cursor: not-allowed; transform: none; box-shadow: none; }
`;

export const Countdown = styled.div<{ $urgente: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $urgente }) => ($urgente ? theme.colors.danger : theme.colors.success)};
`;
