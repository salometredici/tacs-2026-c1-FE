import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SnackbarHost from '../feedback/SnackbarHost';
import { LayoutContainer, MainContent } from './AppLayout.styles';
import { useUserContext } from '../../context/useUserContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserContext();

  const handleProfileClick = () => {
    navigate(`/profile/${currentUser?.id}`);
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
        <Outlet />
      </MainContent>
      <Footer />
      <SnackbarHost />
    </LayoutContainer>
  );
}
