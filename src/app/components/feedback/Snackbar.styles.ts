import styled, { keyframes, css } from 'styled-components';
import { theme } from '../../styles/theme';
import { SnackbarSeverity } from '../../context/SnackbarContextType';

const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
`;

// M3 Snackbar
export const SnackbarContainer = styled.div<{ $closing: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1500;

  min-height: 48px;
  max-width: min(600px, calc(100vw - 32px));
  padding: 14px 16px;

  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  background: ${theme.colors.inverseSurface};
  color: ${theme.colors.inverseOnSurface};
  border-radius: ${theme.shape.extraSmall};
  box-shadow: ${theme.elevation[3]};

  font-size: ${theme.typography.bodyMedium.fontSize};
  line-height: ${theme.typography.bodyMedium.lineHeight};

  animation: ${({ $closing }) =>
    $closing
      ? css`${slideOut} 150ms ease-in forwards`
      : css`${slideIn} 200ms ease-out forwards`};

  @media (min-width: 600px) {
    left: 24px;
    transform: none;
  }
`;

const severityColors: Record<SnackbarSeverity, string> = {
  info:    theme.colors.inverseOnSurface,
  success: theme.colors.successContainer,
  error:   theme.colors.errorContainer,
};

export const SnackbarIcon = styled.span<{ $severity: SnackbarSeverity }>`
  font-size: 20px !important;
  color: ${({ $severity }) => severityColors[$severity]};
  flex-shrink: 0;
`;

export const SnackbarText = styled.span`
  flex: 1;
`;

export const SnackbarClose = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.inverseOnSurface};
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: ${theme.shape.full};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.15s;

  & .material-symbols-outlined { font-size: 18px; }

  &:hover {
    background: rgba(255, 255, 255, ${theme.state.hover});
  }
`;
