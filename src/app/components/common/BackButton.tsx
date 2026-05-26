import styled from 'styled-components';
import { theme } from '../../styles/theme';

type Variant = 'neutral' | 'tonal' | 'text';

interface Props {
  onClick: () => void;
  variant?: Variant;
  label?: string;
  ariaLabel?: string;
}

/**
 * Unifica los 4 estilos de botón "volver" del proyecto:
 * - neutral (default): icon button redondo sobre fondo neutro (PublicationDetail, Proposals)
 * - tonal: icon button redondo con secondaryContainer (CreateAuction)
 * - text: text button con icono + label (AuctionDetail)
 *
 * Si pasás `label`, fuerza variant="text" implícitamente.
 */
export default function BackButton({ onClick, variant, label, ariaLabel }: Props) {
  const v: Variant = label ? 'text' : (variant ?? 'neutral');
  const Btn = v === 'tonal' ? TonalIconBtn : v === 'text' ? TextBtn : NeutralIconBtn;
  return (
    <Btn type="button" onClick={onClick} aria-label={ariaLabel ?? (label ? undefined : 'Volver')}>
      <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      {label && <span>{label}</span>}
    </Btn>
  );
}

const IconBase = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.shape.full};
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  & .material-symbols-outlined { font-size: 22px; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: inherit;
  }
  &:hover::after { opacity: ${theme.state.hover}; }
  &:active::after { opacity: ${theme.state.pressed}; }
`;

const NeutralIconBtn = styled(IconBase)`
  background: none;
  color: ${theme.colors.onSurfaceVariant};
  &::after { background: ${theme.colors.onSurface}; }
`;

const TonalIconBtn = styled(IconBase)`
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  transition: box-shadow 0.15s;
  &::after { background: ${theme.colors.onSecondaryContainer}; }
  &:hover { box-shadow: ${theme.elevation[1]}; }
`;

const TextBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  transition: background-color 0.15s;

  & .material-symbols-outlined { font-size: 20px; }

  &:hover { background: rgba(75, 45, 127, ${theme.state.hover}); }
`;
