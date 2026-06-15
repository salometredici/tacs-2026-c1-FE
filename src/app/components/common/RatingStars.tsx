import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  label?: string;
  max?: number;
  readonly?: boolean;
}

/**
 * Picker de estrellas. Click en un nivel ya seleccionado lo decrementa en 1
 * (permite deseleccionar todas las estrellas yendo de 1 → 0).
 * Modo readonly: omitir `onChange` o pasar `readonly` — renderiza las estrellas
 * sin interactividad (sin hover, sin cursor pointer).
 */
export default function RatingStars({ value, onChange, label, max = 5, readonly }: Props) {
  const isReadonly = readonly || !onChange;
  return (
    <Row>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <Star
          key={n}
          type="button"
          $active={n <= value}
          $readonly={isReadonly}
          disabled={isReadonly}
          onClick={isReadonly ? undefined : () => onChange!(n === value ? n - 1 : n)}
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

const Star = styled.button<{ $active: boolean; $readonly: boolean }>`
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: ${({ $readonly }) => ($readonly ? 'default' : 'pointer')};
  padding: 0 2px;
  line-height: 1;
  color: ${({ $active }) => ($active ? theme.colors.tertiary : theme.colors.outlineVariant)};
  transition: color 0.15s;
  &:hover { color: ${({ $active, $readonly }) =>
    $readonly ? ($active ? theme.colors.tertiary : theme.colors.outlineVariant) : theme.colors.tertiary}; }
`;

const Label = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: 0.9rem;
  color: ${theme.colors.onSurfaceVariant};
`;
