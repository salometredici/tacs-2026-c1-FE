import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.colors.background};
`;

export const LoginCard = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LoginLogo = styled.div`
  margin-bottom: ${theme.spacing.md};
  filter: drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3));
`;

export const LoginTitle = styled.h1`
  margin: 0 0 ${theme.spacing.xs};
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: 0.05em;
`;

export const LoginSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  text-align: center;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const LoginLabel = styled.label`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

export const LoginInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  font-size: 1rem;
  margin-bottom: ${theme.spacing.sm};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const LoginButton = styled.button`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
