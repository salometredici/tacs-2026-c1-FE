import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';
import { User } from '../../interfaces/auth/User';

export type AuthedOutletContext = { currentUser: User };

export default function UserRoute() {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={{ currentUser } satisfies AuthedOutletContext} />;
}
