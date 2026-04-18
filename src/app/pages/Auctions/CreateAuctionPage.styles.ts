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

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: 0;
  line-height: 1;
  &:hover { opacity: 0.7; }
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
`;

export const Hint = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
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

export const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 2px;
  color: ${({ $active }) => ($active ? '#f57c00' : theme.colors.border)};
  transition: color 0.15s;
  line-height: 1;
  &:hover { color: #f57c00; }
`;

export const StarLabel = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
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
