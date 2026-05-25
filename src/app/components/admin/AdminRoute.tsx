import { Navigate, Outlet } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';

/**
 * Guard de la rama `/admin` del router. Hoy protege una sola página (el dashboard), así que el somos conscientes de que podría inlinearse en `AdminLayout`
 * Lo dejamos separado porque más adelante el panel admin se podría partirse en dos (estadísticas + configuración/administración), y entonces este Route va a englobar varias rutas anidadas
 */
export default function AdminRoute() {
  const { isAdminLoggedIn } = useAdminContext();

  if (!isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
