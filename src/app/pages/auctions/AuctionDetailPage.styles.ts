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

export const Card = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.elevation[1]};
  margin-bottom: ${theme.spacing.lg};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  padding-bottom: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

export const CardNumber = styled.div`
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 600;
  color: ${theme.colors.primary};
  min-width: 48px;
  text-align: center;
`;

export const CardInfo = styled.div`
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

export const CategoryBadge = styled.span<{ $category: string }>`
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ $category }) =>
    $category === 'LEGENDARIO' ? '#fff3e0' :
    $category === 'EPICO' ? '#e3f2fd' : '#f5f5f5'};
  color: ${({ $category }) =>
    $category === 'LEGENDARIO' ? '#e65100' :
    $category === 'EPICO' ? '#1565c0' : '#555'};
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

export const RuleItem = styled.div`
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
export const OffersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${theme.spacing.md};
`;

// Bid card compacta — outlined card M3
export const OfferCard = styled.div<{ $status: string }>`
  position: relative;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.outlineVariant};
  border-left: 4px solid ${({ $status }) =>
    $status === 'GANADORA' ? theme.colors.success :
    $status === 'ACTIVA' ? theme.colors.primary :
    $status === 'SUPERADA' ? theme.colors.warning : theme.colors.outline};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${theme.elevation[1]}; }
`;

export const OfferHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
`;

export const OfferBidder = styled.div`
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: 600;
  color: ${theme.colors.onSurface};
  line-height: 1.2;
`;

export const OfferRating = styled.div`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.tertiary};
  margin-top: 2px;

  & .num {
    color: ${theme.colors.onSurfaceVariant};
    margin-left: ${theme.spacing.xs};
  }
`;

export const OfferedCards = styled.div`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  line-height: 1.4;

  & strong { color: ${theme.colors.onSurface}; font-weight: 500; }
`;

export const OfferedCardsList = styled.ul`
  margin: 4px 0 0;
  padding-left: 1.1rem;
  list-style: disc;
`;

export const OfferedCardItem = styled.li`
  margin: 1px 0;
`;

export const OfferDate = styled.div`
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

export const RejectOfferButton = styled.button`
  align-self: flex-start;
  padding: 6px ${theme.spacing.md};
  background: transparent;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: ${theme.colors.error}; color: ${theme.colors.onError ?? '#fff'}; }
  &:disabled { opacity: ${theme.state.disabled}; cursor: not-allowed; }
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

// Botón "Me interesa" — M3 Filled Tonal con ícono de campana
export const InterestButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.primaryContainer};
  color: ${theme.colors.onPrimaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  margin-top: ${theme.spacing.sm};
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${theme.elevation[1]}; }
  &:disabled { opacity: ${theme.state.disabled}; cursor: default; box-shadow: none; }
`;

export const Countdown = styled.div<{ $urgente: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $urgente }) => ($urgente ? theme.colors.danger : theme.colors.success)};
`;

// Row de chips/badges debajo del título de la figurita
export const BadgeRow = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Texto secundario inline al lado de un valor (ej. "★★★★ (4.5)")
export const RatingDecimal = styled.span`
  color: ${theme.colors.textSecondary};
  font-weight: 400;
`;

// Container alineado a la derecha (usado en el InfoRow del cierre)
export const InfoRowRight = styled.div`
  text-align: right;
`;

// Caption pequeño (fecha, fontSize 0.85rem)
export const InfoCaption = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
`;

// Hint pequeño para "sin restricciones"
export const HintText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

// Para "no hay ofertas todavía"
export const EmptyBidsText = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};
`;

// Variante destructiva del BidButton — para "Cancelar subasta"
export const DangerBidButton = styled.button`
  background: ${theme.colors.danger};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.shape.full};
  cursor: pointer;
  font-weight: 500;
  margin-top: ${theme.spacing.md};

  &:hover { opacity: 0.9; }
`;

// Row de botones de acción en una oferta
export const OfferActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Mensaje de error de finalización
export const FinalizeErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.bodyMedium.fontSize};
  margin-top: ${theme.spacing.sm};
`;

