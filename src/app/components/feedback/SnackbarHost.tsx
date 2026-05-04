import { useSnackbar } from '../../context/useSnackbar';
import { SnackbarSeverity } from '../../context/SnackbarContextType';
import {
  SnackbarContainer,
  SnackbarIcon,
  SnackbarText,
  SnackbarClose,
} from './Snackbar.styles';

const ICON_BY_SEVERITY: Record<SnackbarSeverity, string> = {
  info:    'info',
  success: 'check_circle',
  error:   'error',
};

export default function SnackbarHost() {
  const { current, closing, dismiss } = useSnackbar();

  if (!current) return null;

  return (
    <SnackbarContainer
      role="status"
      aria-live="polite"
      $closing={closing}
      key={current.id}
    >
      <SnackbarIcon
        className="material-symbols-outlined"
        $severity={current.severity}
        aria-hidden="true"
      >
        {ICON_BY_SEVERITY[current.severity]}
      </SnackbarIcon>
      <SnackbarText>{current.text}</SnackbarText>
      <SnackbarClose onClick={dismiss} aria-label="Cerrar">
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </SnackbarClose>
    </SnackbarContainer>
  );
}
