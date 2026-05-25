import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SnackbarHost from '../feedback/SnackbarHost';
import { LayoutContainer, MainContent } from './AppLayout.styles';
import { useUserContext } from '../../context/useUserContext';
import { AuthedOutletContext } from './UserRoute';

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useUserContext();
  const outletContext = useOutletContext<AuthedOutletContext>();
  const { currentUser } = outletContext;

  const handleProfileClick = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Navbar
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
      <MainContent>
        <Outlet context={outletContext} />
      </MainContent>
      <Footer />
      <SnackbarHost />
    </LayoutContainer>
  );
}
