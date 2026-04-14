import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const AdminLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${theme.colors.background};
`;

export const AdminLoginCard = styled.div`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  width: 340px;
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
  font-size: 1.6rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: 0.05em;
`;

export const AdminLoginSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  text-align: center;
`;

export const AdminLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const AdminLoginLabel = styled.label`
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

export const AdminLoginInput = styled.input`
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

export const AdminLoginButton = styled.button`
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

export const AdminLoginError = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  font-size: 0.85rem;
  color: ${theme.colors.danger};
  text-align: center;
`;
