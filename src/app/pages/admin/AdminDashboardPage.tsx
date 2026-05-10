import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';
import { adminStatsMock } from '../../../mocks/adminStatsMock';
import {
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  LogoutButton,
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
    navigate('/admin/login');
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <div>
          <DashboardTitle>Panel de Administrador</DashboardTitle>
          <DashboardSubtitle>TACS K3061 — Intercambio de Figuritas Mundial 2026</DashboardSubtitle>
        </div>
        <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
      </DashboardHeader>

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
    </DashboardContainer>
  );
}
