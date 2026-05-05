import { createContext, useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import {
  SnackbarContextType,
  SnackbarMessage,
  SnackbarSeverity,
} from './SnackbarContextType';

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

const AUTO_DISMISS_MS = 4000;
const EXIT_ANIMATION_MS = 150;

let nextId = 1;

interface Props {
  children: ReactNode;
}

export function SnackbarProvider({ children }: Props) {
  const [current, setCurrent] = useState<SnackbarMessage | null>(null);
  const [closing, setClosing] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
  };

  const dismiss = useCallback(() => {
    clearTimers();
    setClosing(true);
    exitTimer.current = setTimeout(() => {
      setCurrent(null);
      setClosing(false);
    }, EXIT_ANIMATION_MS);
  }, []);

  const show = useCallback(
    (text: string, severity: SnackbarSeverity = 'info') => {
      clearTimers();
      setClosing(false);
      setCurrent({ id: nextId++, text, severity });
      dismissTimer.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const showSuccess = useCallback((text: string) => show(text, 'success'), [show]);
  const showError = useCallback((text: string) => show(text, 'error'), [show]);

  useEffect(() => () => clearTimers(), []);

  return (
    <SnackbarContext.Provider
      value={{ current, closing, show, showSuccess, showError, dismiss }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}
