import { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  gap: ${theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${theme.typography.titleSmall.fontSize};
  font-weight: ${theme.typography.titleSmall.fontWeight};
  color: ${theme.colors.onSurface};
`;

interface Props {
  title: ReactNode;
  count?: number;
  action?: ReactNode;
}

export default function SectionHeader({ title, count, action }: Props) {
  return (
    <Row>
      <Title>
        {title}
        {count != null && ` (${count})`}
      </Title>
      {action}
    </Row>
  );
}
