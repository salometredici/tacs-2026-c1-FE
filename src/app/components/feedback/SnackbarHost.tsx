import { Toaster } from 'sonner';

// Monta el contenedor de toasts de sonner. El look M3 lo maneja `Snackbar` vía toast.custom, así que `<Toaster />` queda sin estilos visibles (solo posición y configuración)
export default function SnackbarHost() {
  return (
    <Toaster
      position="bottom-left"
      gap={8}
      visibleToasts={3}
    />
  );
}
