import { ReactNode } from 'react';
import {
  Overlay, Dialog, Title, Message, Footer, CancelButton, ConfirmButton,
} from './ConfirmDialog.styles';

interface Props {
  open: boolean;
  title: string;
  message?: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmación M3 reusable. Reemplaza `window.confirm(...)` para mantener look consistente
 * con el resto del UI y permitir copy personalizado (label de botones, mensaje opcional con detalle).
 * Para contenido rico (warnings, summaries) pasarlo como `children` en vez de `message`.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loadingLabel = 'Procesando...',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget && !loading) onCancel(); }}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <Title id="confirm-dialog-title">{title}</Title>
        {children ?? (message && <Message>{message}</Message>)}
        <Footer>
          <CancelButton type="button" onClick={onCancel} disabled={loading}>{cancelLabel}</CancelButton>
          <ConfirmButton type="button" $destructive={destructive} onClick={onConfirm} disabled={loading}>
            {loading ? loadingLabel : confirmLabel}
          </ConfirmButton>
        </Footer>
      </Dialog>
    </Overlay>
  );
}
