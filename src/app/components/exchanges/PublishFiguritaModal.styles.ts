import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

export const Modal = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
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
  color: ${theme.colors.primary};
  margin: 0;
  font-size: 1.3rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  line-height: 1;
  &:hover { color: ${theme.colors.text}; }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${theme.colors.text};
  }
`;

export const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

export const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;

export const TypeToggle = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const TypeOption = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm};
  border: 2px solid ${({ $active }) => $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active }) => $active ? theme.colors.primary : 'white'};
  color: ${({ $active }) => $active ? 'white' : theme.colors.textSecondary};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

export const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  &:hover { border-color: ${theme.colors.text}; color: ${theme.colors.text}; }
`;

export const SubmitButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #1565c0; }
  &:disabled { background: ${theme.colors.border}; cursor: not-allowed; }
`;

export const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
  margin: 0;
`;
