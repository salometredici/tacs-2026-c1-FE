import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const AdminLayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

export default function AdminLayout() {
  return (
    <AdminLayoutContainer>
      <Outlet />
      <Toaster position="bottom-right" />
    </AdminLayoutContainer>
  );
}
