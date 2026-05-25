import { toast } from 'sonner';
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

interface SnackbarProps {
  id: string | number;
  text: string;
  severity: SnackbarSeverity;
}

//Render M3 de un snackbar individual. Lo usa `toast.custom(...)` para reemplazar el look default de sonner por nuestros styled-components
export default function Snackbar({ id, text, severity }: SnackbarProps) {
  return (
    <SnackbarContainer role="status" aria-live="polite" $closing={false}>
      <SnackbarIcon
        className="material-symbols-outlined"
        $severity={severity}
        aria-hidden="true"
      >
        {ICON_BY_SEVERITY[severity]}
      </SnackbarIcon>
      <SnackbarText>{text}</SnackbarText>
      <SnackbarClose onClick={() => toast.dismiss(id)} aria-label="Cerrar">
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </SnackbarClose>
    </SnackbarContainer>
  );
}
