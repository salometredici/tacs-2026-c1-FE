import styled from 'styled-components';
import { theme } from '../../styles/theme';

// M3 Dialog overlay
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.scrim};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

export const Modal = styled.div`
  background: ${theme.colors.surfaceContainerHigh};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[3]};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  color: ${theme.colors.onSurface};
  margin: 0;
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
`;

// M3 icon button (close)
export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${theme.colors.onSurfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onSurface};
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }

  &:hover { color: ${theme.colors.onSurface}; &::after { opacity: ${theme.state.hover}; } }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  label {
    font-size: ${theme.typography.labelLarge.fontSize};
    font-weight: ${theme.typography.labelLarge.fontWeight};
    color: ${theme.colors.onSurface};
  }
`;

export const Hint = styled.p`
  margin: 0;
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

// M3 Outlined Text Field
export const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }
  &:focus { border: 2px solid ${theme.colors.primary}; }
  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

// M3 List Item — selectable (mismo patrón que CreateAuctionPage)
export const SelectableItem = styled.div<{ $selected: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${({ $selected }) => $selected ? theme.colors.secondaryContainer : theme.colors.surfaceContainerLowest};
  border-radius: ${theme.shape.small};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: background 0.15s;
  &:hover { background: ${({ $selected, $disabled }) =>
    $disabled ? undefined :
    $selected ? theme.colors.secondaryContainer : theme.colors.surfaceContainerLow}; }
`;

export const SelectIndicator = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  color: ${({ $selected }) => $selected ? theme.colors.primary : theme.colors.onSurfaceVariant};
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

// M3 Text Button
export const CancelButton = styled.button`
  padding: 10px ${theme.spacing.md};
  background: none;
  border: none;
  border-radius: ${theme.shape.full};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

// M3 Filled Button
export const SubmitButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.shape.full};
  color: ${theme.colors.onPrimary};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:disabled { background: rgba(26,28,30,0.12); color: rgba(26,28,30,0.38); cursor: not-allowed; box-shadow: none; }
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.bodySmall.fontSize};
  margin: 0;
  background: ${theme.colors.errorContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
`;
