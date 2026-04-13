import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
`;
