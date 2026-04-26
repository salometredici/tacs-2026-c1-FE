import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';

export default function UserRoute() {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
