import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';
import { adminStatsMock } from '../../../mocks/adminStatsMock';
import {
  DashboardOuter,
  DashboardHeaderBar,
  HeaderBrand,
  HeaderIcon,
  DashboardTitle,
  LogoutButton,
  DashboardContent,
  DashboardSubtitle,
  WipNotice,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
} from './AdminDashboardPage.styles';

interface StatItem {
  icon: string;
  value: number;
  label: string;
}

const stats: StatItem[] = [
  { icon: 'group', value: adminStatsMock.totalUsuarios, label: 'Usuarios registrados' },
  { icon: 'style', value: adminStatsMock.figuritasPublicadas, label: 'Figuritas publicadas' },
  { icon: 'description', value: adminStatsMock.propuestasRealizadas, label: 'Propuestas realizadas' },
  { icon: 'gavel', value: adminStatsMock.subastasActivas, label: 'Subastas activas' },
  { icon: 'handshake', value: adminStatsMock.intercambiosConcretados, label: 'Intercambios concretados' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminLogout } = useAdminContext();

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  return (
    <DashboardOuter>
      <DashboardHeaderBar>
        <HeaderBrand>
          <HeaderIcon>
            <span className="material-symbols-outlined" aria-hidden="true">shield_person</span>
          </HeaderIcon>
          <DashboardTitle>Panel de Administrador — TACS K3061</DashboardTitle>
        </HeaderBrand>
        <LogoutButton onClick={handleLogout}>
          <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          Cerrar sesión
        </LogoutButton>
      </DashboardHeaderBar>

      <DashboardContent>
        <DashboardSubtitle>Intercambio de Figuritas Mundial 2026</DashboardSubtitle>

        <WipNotice>
          <span className="material-symbols-outlined" aria-hidden="true">construction</span>
          Datos mostrados a partir de mocks — integración con el backend pendiente (WIP)
        </WipNotice>

        <SectionTitle>Estadísticas generales</SectionTitle>
        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.label}>
              <StatIcon>
                <span className="material-symbols-outlined" aria-hidden="true">{stat.icon}</span>
              </StatIcon>
              <StatValue>{stat.value.toLocaleString('es-AR')}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </DashboardContent>
    </DashboardOuter>
  );
}
