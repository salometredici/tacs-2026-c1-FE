import { Navigate, Outlet } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';

export default function AdminRoute() {
  const { isAdminLoggedIn } = useAdminContext();

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
