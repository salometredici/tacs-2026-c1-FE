import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { LayoutContainer, MainContent } from './AppLayout.styles';

export default function AppLayout() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    // TODO: Obtener ID del usuario logueado del context/estado
    navigate('/profile/1');
  };

  const handleLogout = () => {
    // TODO: Limpiar contexto/estado de usuario
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Navbar
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
}
