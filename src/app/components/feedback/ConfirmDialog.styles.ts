import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Dialog = styled.div`
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

export const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${theme.colors.text};
`;

export const Message = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.5;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

export const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  &:hover { background: ${theme.colors.background}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const ConfirmButton = styled.button<{ $destructive?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${({ $destructive }) => $destructive ? theme.colors.danger : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: ${({ $destructive }) => $destructive ? '#b71c1c' : theme.colors.primary}; opacity: ${({ $destructive }) => $destructive ? 1 : 0.9}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
