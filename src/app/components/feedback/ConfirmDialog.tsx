import { ReactNode } from 'react';
import {
  Overlay, Dialog, Title, Message, Footer, CancelButton, ConfirmButton,
} from './ConfirmDialog.styles';

interface Props {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal de confirmación M3 reusable. Reemplaza `window.confirm(...)` para mantener look consistente
 * con el resto del UI y permitir copy personalizado (label de botones, mensaje opcional con detalle)
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
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
        {message && <Message>{message}</Message>}
        <Footer>
          <CancelButton type="button" onClick={onCancel} disabled={loading}>{cancelLabel}</CancelButton>
          <ConfirmButton type="button" $destructive={destructive} onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </ConfirmButton>
        </Footer>
      </Dialog>
    </Overlay>
  );
}
