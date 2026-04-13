import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import { LayoutContainer, MainContent } from './AppLayout.styles';
import { useUserContext } from '../../context/useUserContext';
import { mockUser } from '../../../mocks/usersMock';

export default function AppLayout() {
  const navigate = useNavigate();
  const { currentUser, login, logout } = useUserContext();

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
        onHomeClick={() => {navigate('/');}}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
      <Toaster position="bottom-right" />
    </LayoutContainer>
  );
}
