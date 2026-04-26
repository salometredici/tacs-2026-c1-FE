import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FooterContainer = styled.footer`
  background-color: ${theme.colors.surfaceContainerHigh};
  color: ${theme.colors.onSurfaceVariant};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  margin-top: auto;
  border-top: 1px solid ${theme.colors.outlineVariant};
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.xl};
`;

export const FooterSection = styled.div`
  h3 {
    margin-top: 0;
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.typography.titleSmall.fontSize};
    font-weight: ${theme.typography.titleSmall.fontWeight};
    color: ${theme.colors.onSurface};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  p, a {
    margin: ${theme.spacing.xs} 0;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.onSurfaceVariant};
  }

  a {
    &:hover { color: ${theme.colors.primary}; text-decoration: underline; }
  }
`;

export const CopyrightSection = styled.div`
  text-align: center;
  padding-top: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.outlineVariant};
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;
