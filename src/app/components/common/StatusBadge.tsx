import { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export type StatusTone = 'success' | 'warning' | 'error' | 'neutral' | 'info';
type Size = 'sm' | 'md';

const Badge = styled.span<{ $tone: StatusTone; $size: Size }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: ${theme.shape.small};
  letter-spacing: 0.04em;
  white-space: nowrap;
  padding: ${({ $size }) => ($size === 'md' ? '4px 12px' : '2px 10px')};
  font-size: ${({ $size }) =>
    $size === 'md' ? theme.typography.labelMedium.fontSize : theme.typography.labelSmall.fontSize};
  font-weight: ${theme.typography.labelSmall.fontWeight};
  background: ${({ $tone }) => TONE_BG[$tone]};
  color: ${({ $tone }) => TONE_FG[$tone]};

  & .material-symbols-outlined {
    font-size: 14px;
  }
`;

const TONE_BG: Record<StatusTone, string> = {
  success: theme.colors.successContainer,
  warning: theme.colors.tertiaryContainer,
  error:   theme.colors.errorContainer,
  neutral: theme.colors.surfaceContainerHighest,
  info:    theme.colors.primaryContainer,
};

const TONE_FG: Record<StatusTone, string> = {
  success: theme.colors.success,
  warning: theme.colors.onTertiaryContainer,
  error:   theme.colors.onErrorContainer,
  neutral: theme.colors.onSurfaceVariant,
  info:    theme.colors.onPrimaryContainer,
};

interface Props {
  tone: StatusTone;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}

export default function StatusBadge({ tone, size = 'sm', icon, children }: Props) {
  return (
    <Badge $tone={tone} $size={size}>
      {icon}
      {children}
    </Badge>
  );
}
