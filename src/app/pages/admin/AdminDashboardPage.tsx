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
  { icon: '👥', value: adminStatsMock.totalUsuarios, label: 'Usuarios registrados' },
  { icon: '🃏', value: adminStatsMock.figuritasPublicadas, label: 'Figuritas publicadas' },
  { icon: '📋', value: adminStatsMock.propuestasRealizadas, label: 'Propuestas realizadas' },
  { icon: '🔨', value: adminStatsMock.subastasActivas, label: 'Subastas activas' },
  { icon: '🤝', value: adminStatsMock.intercambiosConcretados, label: 'Intercambios concretados' },
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
            <StatIcon>{stat.icon}</StatIcon>
            <StatValue>{stat.value.toLocaleString('es-AR')}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>
    </DashboardContainer>
  );
}
