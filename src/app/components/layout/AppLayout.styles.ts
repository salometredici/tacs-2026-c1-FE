import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

export const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};

  @media (max-width: 600px) {
    padding: ${theme.spacing.md};
  }
`;
