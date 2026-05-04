import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import SnackbarHost from '../feedback/SnackbarHost';

const AdminLayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

export default function AdminLayout() {
  return (
    <AdminLayoutContainer>
      <Outlet />
      <SnackbarHost />
    </AdminLayoutContainer>
  );
}
