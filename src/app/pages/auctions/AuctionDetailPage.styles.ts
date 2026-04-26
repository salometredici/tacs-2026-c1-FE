import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: 0;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  &:hover { opacity: 0.7; }
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  margin-bottom: ${theme.spacing.lg};
`;

export const FiguritaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const FiguritaNumero = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  min-width: 80px;
  text-align: center;
`;

export const FiguritaInfo = styled.div`
  flex: 1;
  h2 { margin: 0 0 0.25rem; font-size: 1.5rem; }
  p { margin: 0.2rem 0; font-size: 0.9rem; color: ${theme.colors.textSecondary}; }
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
  font-size: 1rem;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${theme.spacing.md};
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border};
  font-size: 0.95rem;
  &:last-child { border-bottom: none; }
  .label { color: ${theme.colors.textSecondary}; }
  .value { font-weight: 600; color: ${theme.colors.text}; }
`;

export const ReglaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} 0;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  border-bottom: 1px solid ${theme.colors.border};
  &:last-child { border-bottom: none; }
  &::before { content: '•'; color: ${theme.colors.primary}; font-size: 1.2rem; }
`;

export const OfertaRow = styled.div<{ $estado: string }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.background};
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 4px solid ${({ $estado }) =>
    $estado === 'GANADORA' ? theme.colors.success :
    $estado === 'ACTIVA' ? theme.colors.primary :
    $estado === 'SUPERADA' ? theme.colors.warning : theme.colors.border};
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
