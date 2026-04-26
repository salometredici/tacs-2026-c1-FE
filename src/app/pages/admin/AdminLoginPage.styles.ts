import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const AdminLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.md};
`;

export const AdminLoginCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[1]};
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AdminLoginIcon = styled.div`
  margin-bottom: ${theme.spacing.md};
  font-size: 3rem;
  line-height: 1;
`;

export const AdminLoginTitle = styled.h1`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  color: ${theme.colors.onSurface};
`;

export const AdminLoginSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.xl};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
  text-align: center;
`;

export const AdminLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const AdminLoginLabel = styled.label`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurfaceVariant};
  margin-bottom: -${theme.spacing.xs};
`;

export const AdminLoginInput = styled.input`
  padding: ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
  border: 1px solid ${theme.colors.outline};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }

  &:focus {
    border: 2px solid ${theme.colors.primary};
  }

  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

export const AdminLoginButton = styled.button`
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

export const AdminLoginError = styled.p`
  margin: 0;
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.error};
  text-align: center;
  background: ${theme.colors.errorContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.extraSmall};
`;
