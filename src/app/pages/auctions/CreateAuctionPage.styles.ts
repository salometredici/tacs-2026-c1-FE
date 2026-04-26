import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

// M3 Icon Button
export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.onSurfaceVariant};
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
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
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
`;

export const Title = styled.h1`
  color: ${theme.colors.onBackground};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  margin: 0;
`;

// M3 Elevated Card
export const Card = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
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
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurface};
`;

export const Hint = styled.span`
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

// M3 Outlined Select
export const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  cursor: pointer;
  outline: none;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }
  &:focus { border: 2px solid ${theme.colors.primary}; }
`;

// M3 Outlined Input
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
`;

export const StarsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
  flex-wrap: wrap;
`;

export const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 2px;
  color: ${({ $active }) => ($active ? theme.colors.tertiary : theme.colors.outlineVariant)};
  transition: color 0.15s;
  line-height: 1;
  &:hover { color: ${theme.colors.tertiary}; }
`;

export const StarLabel = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.error};
  font-size: ${theme.typography.bodySmall.fontSize};
  background: ${theme.colors.errorContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
  margin: 0;
`;

// M3 Filled Button
export const SubmitButton = styled.button`
  padding: 10px ${theme.spacing.xl};
  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  align-self: flex-end;
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

  &:disabled {
    background: rgba(26, 28, 30, 0.12);
    color: rgba(26, 28, 30, 0.38);
    cursor: not-allowed;
    box-shadow: none;
  }
`;
