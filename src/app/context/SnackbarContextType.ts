export type SnackbarSeverity = 'info' | 'success' | 'error';

export interface SnackbarMessage {
  id: number;
  text: string;
  severity: SnackbarSeverity;
}

export interface SnackbarContextType {
  current: SnackbarMessage | null;
  closing: boolean;
  show: (text: string, severity?: SnackbarSeverity) => void;
  showSuccess: (text: string) => void;
  showError: (text: string) => void;
  dismiss: () => void;
}
