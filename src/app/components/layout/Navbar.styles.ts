import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const NavbarContainer = styled.nav`
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.shadows.md};
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const BrandTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
