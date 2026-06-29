import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

export const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d1b4e;
  padding: ${theme.spacing.md};
  text-align: center;
`;

// M3 Elevated Card
export const NotFoundCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  border-radius: ${theme.shape.extraLarge};
  box-shadow: ${theme.elevation[1]};
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NotFoundCode = styled.p`
  margin: 0;
  font-size: ${theme.typography.displayLarge.fontSize};
  line-height: ${theme.typography.displayLarge.lineHeight};
  font-weight: 400;
  color: ${theme.colors.primary};
`;

export const NotFoundTitle = styled.h1`
  margin: ${theme.spacing.sm} 0 ${theme.spacing.xs};
  font-size: ${theme.typography.headlineSmall.fontSize};
  line-height: ${theme.typography.headlineSmall.lineHeight};
  font-weight: 400;
  color: ${theme.colors.onSurface};
`;

export const NotFoundSubtitle = styled.p`
  margin: 0 0 ${theme.spacing.xl};
  font-size: ${theme.typography.bodyMedium.fontSize};
  color: ${theme.colors.onSurfaceVariant};
`;

// M3 Filled Button (como link)
export const NotFoundHomeLink = styled(Link)`
  padding: 10px ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &:hover { text-decoration: none; box-shadow: ${theme.elevation[1]}; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover::after { opacity: ${theme.state.hover}; }
  &:active::after { opacity: ${theme.state.pressed}; }
`;
