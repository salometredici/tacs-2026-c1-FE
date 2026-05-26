import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminContext } from '../../context/useAdminContext';
import { API_CONFIG } from '../../config/apiConfig';
import {
  DashboardOuter,
  DashboardHeaderBar,
  HeaderBrand,
  HeaderIcon,
  DashboardTitle,
  LogoutButton,
  DashboardContent,
  DashboardSubtitle,
  SectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
} from './AdminDashboardPage.styles';

interface AdminStats {
  totalUsers: number | null;
  activeAuctions: number | null;
  activePublications: number | null;
}

interface Paginated<T> { data: T[]; currentPage: number; totalPages: number }

const fetchAdminStats = async (): Promise<AdminStats> => {
  const [usersRes, auctionsRes, publicationsRes] = await Promise.allSettled([
    axios.get<unknown[]>(API_CONFIG.users.base),
    axios.get<Paginated<unknown>>(API_CONFIG.auctions.base, { params: { per_page: 9999, page: 1 } }),
    axios.get<Paginated<unknown>>(API_CONFIG.publications.base, { params: { per_page: 9999, page: 1 } }),
  ]);
  return {
    totalUsers:        usersRes.status        === 'fulfilled' ? usersRes.value.data.length               : null,
    activeAuctions:    auctionsRes.status     === 'fulfilled' ? auctionsRes.value.data.data.length       : null,
    activePublications: publicationsRes.status === 'fulfilled' ? publicationsRes.value.data.data.length  : null,
  };
};

const STAT_ITEMS = (stats: AdminStats) => [
  { icon: 'group',   value: stats.totalUsers,          label: 'Usuarios registrados'   },
  { icon: 'gavel',   value: stats.activeAuctions,       label: 'Subastas activas'        },
  { icon: 'style',   value: stats.activePublications,   label: 'Publicaciones activas'   },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminLogout } = useAdminContext();
  const [stats, setStats] = useState<AdminStats>({ totalUsers: null, activeAuctions: null, activePublications: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

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

        <SectionTitle>Estadísticas generales</SectionTitle>
        <StatsGrid>
          {STAT_ITEMS(stats).map(stat => (
            <StatCard key={stat.label}>
              <StatIcon>
                <span className="material-symbols-outlined" aria-hidden="true">{stat.icon}</span>
              </StatIcon>
              <StatValue>
                {loading ? '…' : stat.value !== null ? stat.value.toLocaleString('es-AR') : 'N/D'}
              </StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </DashboardContent>
    </DashboardOuter>
  );
}
