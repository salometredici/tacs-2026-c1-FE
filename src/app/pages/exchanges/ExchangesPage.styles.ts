import styled from 'styled-components';
import { ExchangeType } from '../../interfaces/exchanges/Exchange';
import {  } from '../../interfaces/publicaciones/Publicacion';
import { theme } from '../../styles/theme';
import { TIPO_PARTICIPACION } from '../../interfaces/publicaciones/publicacionTypes';

export const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const PageTitle = styled.h1`
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  margin: 0 0 ${theme.spacing.xl} 0;
`;

export const ExchangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const ExchangeCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const ExchangeInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const ExchangeTitle = styled.p`
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
  font-size: 1rem;
`;

export const ExchangeDetail = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
  font-size: 0.875rem;
`;

export const TypeBadge = styled.span<{ $type: ExchangeType }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => $type === 'SUBASTA' ? '#e3f2fd' : '#f3e5f5'};
  color: ${({ $type }) => $type === 'SUBASTA' ? '#1565c0' : '#6a1b9a'};
`;

export const RateButton = styled.button`
  padding: 0.4rem 1rem;
  background: ${theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`;

export const RatedLabel = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xl};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  margin: 0;
`;

export const PublishButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1565c0; }
`;

export const PublicationCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const PublicationTypeBadge = styled.span<{ $tipo: TIPO_PARTICIPACION }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $tipo }) => $tipo === 'SUBASTA' ? '#e3f2fd' : '#e8f5e9'};
  color: ${({ $tipo }) => $tipo === 'SUBASTA' ? '#1565c0' : '#388e3c'};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: ${theme.spacing.xl} 0;
`;

// ─── Rating modal ────────────────────────────────────────────────────────────

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

export const Modal = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
  max-width: 420px;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const ModalTitle = styled.h2`
  color: ${theme.colors.primary};
  margin: 0;
  font-size: 1.2rem;
`;

export const StarsRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: ${({ $active }) => $active ? '#f57c00' : theme.colors.border};
  transition: color 0.1s;
  &:hover { color: #f57c00; }
`;

export const CommentInput = styled.textarea`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

export const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  &:hover { border-color: ${theme.colors.text}; color: ${theme.colors.text}; }
`;

export const SubmitButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #1565c0; }
  &:disabled { background: ${theme.colors.border}; cursor: not-allowed; }
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
  margin: 0;
`;
