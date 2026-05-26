import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  max?: number;
}

/**
 * Click en un nivel ya seleccionado lo decrementa en 1 (permite deseleccionar
 * todas las estrellas yendo de 1 → 0)
 */
export default function RatingStars({ value, onChange, label, max = 5 }: Props) {
  return (
    <Row>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <Star
          key={n}
          type="button"
          $active={n <= value}
          onClick={() => onChange(n === value ? n - 1 : n)}
          title={`${n} estrella${n !== 1 ? 's' : ''}`}
        >
          ★
        </Star>
      ))}
      {label && <Label>{label}</Label>}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Star = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  color: ${({ $active }) => ($active ? theme.colors.tertiary : theme.colors.outlineVariant)};
  transition: color 0.15s;
  &:hover { color: ${theme.colors.tertiary}; }
`;

const Label = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: 0.9rem;
  color: ${theme.colors.onSurfaceVariant};
`;
