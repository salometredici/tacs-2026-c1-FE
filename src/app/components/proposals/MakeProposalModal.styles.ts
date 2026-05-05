import styled from 'styled-components';
import { theme } from '../../styles/theme';

// M3 Outlined Text Field
export const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  box-sizing: border-box;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }
  &:focus { border: 2px solid ${theme.colors.primary}; }
  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

export const SectionLabel = styled.p`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.04em;
  color: ${theme.colors.onSurface};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.shape.extraSmall};
  background: ${theme.colors.surfaceContainerLowest};

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${theme.colors.outlineVariant}; border-radius: 2px; }
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.outlineVariant} transparent;
`;

export const FiguritaItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  gap: ${theme.spacing.sm};
  transition: background 0.1s;

  &:not(:last-child) { border-bottom: 1px solid ${theme.colors.outlineVariant}; }
  &:hover { background: ${theme.colors.surfaceContainerLow}; }
`;

export const CardNum = styled.span`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: 600;
  color: ${theme.colors.primary};
  min-width: 40px;
`;

export const CardDescription = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  line-height: ${theme.typography.bodySmall.lineHeight};
  color: ${theme.colors.onSurface};
  flex: 1;
`;

export const CardQuantityLabel = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  min-width: 28px;
  text-align: right;
`;

// M3 Filled Tonal Button
export const AddButton = styled.button`
  padding: 4px 14px;
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  white-space: nowrap;
  transition: box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: ${theme.colors.onSecondaryContainer};
    opacity: 0; transition: opacity 0.15s; border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
`;

// M3 Outlined Button (error tonal)
export const RemoveButton = styled.button`
  padding: 4px 14px;
  background: none;
  color: ${theme.colors.error};
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover { background: ${theme.colors.errorContainer}; }
`;

export const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const QtyButton = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.surfaceContainerHigh};
  color: ${theme.colors.onSurface};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: background 0.1s;

  &:hover { background: ${theme.colors.surfaceContainerHighest}; }
  &:disabled { opacity: 0.38; cursor: not-allowed; }
`;

export const QtyDisplay = styled.span`
  font-size: ${theme.typography.bodyMedium.fontSize};
  font-weight: 500;
  color: ${theme.colors.onSurface};
  min-width: 20px;
  text-align: center;
`;

export const EmptyItem = styled.p`
  padding: ${theme.spacing.md};
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodySmall.fontSize};
  margin: 0;
  text-align: center;
  font-style: italic;
`;
