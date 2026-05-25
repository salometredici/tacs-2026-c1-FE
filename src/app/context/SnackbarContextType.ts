export type SnackbarSeverity = 'info' | 'success' | 'error';

export interface SnackbarContextType {
  show: (text: string, severity?: SnackbarSeverity) => void;
  showSuccess: (text: string) => void;
  showError: (text: string) => void;
  dismiss: () => void;
}
