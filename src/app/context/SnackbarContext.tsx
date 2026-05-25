import { createContext, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import Snackbar from '../components/feedback/Snackbar';
import { SnackbarContextType, SnackbarSeverity } from './SnackbarContextType';

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

interface Props {
  children: ReactNode;
}

/**
 * Wrapper sobre sonner. Conserva la API `useSnackbar()` previa (show/showSuccess/showError/dismiss) para no romper los consumidores
 * Por dentro delega en `toast.custom` de sonner, que maneja la queue, accessibility y dismissal. El render M3 vive en el componente Snackbar
 */
export function SnackbarProvider({ children }: Props) {
  const value = useMemo<SnackbarContextType>(() => {
    const show = (text: string, severity: SnackbarSeverity = 'info') =>
      toast.custom(
        (id) => <Snackbar id={id} text={text} severity={severity} />,
        { duration: 4000 }
      );

    return {
      show,
      showSuccess: (text: string) => show(text, 'success'),
      showError:   (text: string) => show(text, 'error'),
      dismiss:     () => toast.dismiss(),
    };
  }, []);

  return (
    <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>
  );
}
