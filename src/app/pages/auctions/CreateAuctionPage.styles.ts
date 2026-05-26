import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

export const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  margin: 0;
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Hint = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

// Input numérico chico (duración, mínimos, etc.) — width fijo de 100px
export const NumericInputSmall = styled.input`
  width: 100px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

// Texto pequeño junto a un input (ej. "horas (1 día)")
export const InputSuffix = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const Select = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

// Selectable list item (single-select card) — extends CardItem visual with state
export const SelectableItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  gap: ${theme.spacing.sm};
  cursor: pointer;
  transition: background 0.1s;
  background: ${({ $selected }) => $selected ? theme.colors.secondaryContainer : 'transparent'};

  &:not(:last-child) { border-bottom: 1px solid ${theme.colors.outlineVariant}; }
  &:hover { background: ${({ $selected }) => $selected ? theme.colors.secondaryContainer : theme.colors.surfaceContainerLow}; }
`;

export const SelectIndicator = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: ${({ $selected }) => $selected ? theme.colors.primary : theme.colors.outline};

  & .material-symbols-outlined {
    font-size: 22px;
    font-variation-settings: 'FILL' ${({ $selected }) => $selected ? 1 : 0};
  }
`;

export const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  color: ${theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const StarsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.9rem;
  margin: 0;
`;

export const SubmitButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover:not(:disabled) {
    background: #1565c0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:disabled {
    background: ${theme.colors.border};
    cursor: not-allowed;
  }
`;
