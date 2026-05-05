import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d1b4e;
  padding: ${theme.spacing.md};
`;

// M3 Elevated Card
export const LoginCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[1]};
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LoginLogo = styled.div`
  margin-bottom: ${theme.spacing.md};
  filter: drop-shadow(0 4px 12px rgba(27, 95, 168, 0.25));
`;

export const LoginTitle = styled.h1`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.typography.headlineSmall.fontSize};
  line-height: ${theme.typography.headlineSmall.lineHeight};
  font-weight: 400;
  color: ${theme.colors.onSurface};
`;

export const LoginSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.xl};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  text-align: center;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const LoginLabel = styled.label`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurfaceVariant};
  margin-bottom: -${theme.spacing.xs};
`;

// M3 Outlined Text Field
export const LoginInput = styled.input`
  padding: ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
  border: 1px solid ${theme.colors.outline};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }

  &:focus {
    border: 2px solid ${theme.colors.primary};
  }

  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

// M3 Filled Button
export const LoginButton = styled.button`
  margin-top: ${theme.spacing.sm};
  padding: 10px ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
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

  &:hover::after { opacity: ${theme.state.hover}; }
  &:active::after { opacity: ${theme.state.pressed}; }

  &:hover { box-shadow: ${theme.elevation[1]}; }

  &:disabled {
    background: rgba(26, 28, 30, 0.12);
    color: rgba(26, 28, 30, 0.38);
    cursor: not-allowed;
  }
`;
