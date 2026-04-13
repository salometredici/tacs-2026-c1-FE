import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FooterContainer = styled.footer`
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  margin-top: auto;
  border-top: 2px solid ${theme.colors.border};
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
`;

export const FooterSection = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: ${theme.spacing.md};
    font-size: 1rem;
  }

  p,
  a {
    margin: ${theme.spacing.sm} 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);
  }

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: underline;

    &:hover {
      color: white;
    }
  }
`;

export const CopyrightSection = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;
