import { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Message = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
  padding: ${theme.spacing.xl};
`;

interface Props {
  children: ReactNode;
}

export default function EmptyState({ children }: Props) {
  return <Message>{children}</Message>;
}
