import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminContext } from '../../context/useAdminContext';
import { useSnackbar } from '../../context/useSnackbar';
import { API_CONFIG } from '../../config/apiConfig';
import { getSettings, updateSettings } from '../../api/SettingsService';
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
  ConfigSectionTitle,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  ConfigCard,
  ConfigLabel,
  ConfigHelp,
  ConfigRow,
  ConfigInput,
  ConfigButton,
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
  const { showSuccess, showError } = useSnackbar();
  const [stats, setStats] = useState<AdminStats>({ totalUsers: null, activeAuctions: null, activePublications: null });
  const [loading, setLoading] = useState(true);

  const [maxPending, setMaxPending] = useState<number | null>(null);
  const [maxPendingInput, setMaxPendingInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getSettings()
      .then(s => { setMaxPending(s.maxPendingProposals); setMaxPendingInput(String(s.maxPendingProposals)); })
      .catch(() => { /* el banner muestra N/D */ });
  }, []);

  const handleSaveSettings = async () => {
    const value = parseInt(maxPendingInput, 10);
    if (!Number.isInteger(value) || value < 1) {
      showError('El tope debe ser un número entero mayor o igual a 1.');
      return;
    }
    setSavingSettings(true);
    try {
      const updated = await updateSettings(value);
      setMaxPending(updated.maxPendingProposals);
      setMaxPendingInput(String(updated.maxPendingProposals));
      showSuccess('Configuración actualizada');
    } catch {
      showError('No se pudo actualizar la configuración. Intentá de nuevo.');
    } finally {
      setSavingSettings(false);
    }
  };

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

        <ConfigSectionTitle>Configuración</ConfigSectionTitle>
        <ConfigCard>
          <ConfigLabel htmlFor="max-pending">Máximo de propuestas pendientes por publicación</ConfigLabel>
          <ConfigHelp>
            Tope de propuestas en estado PENDIENTE que puede recibir una publicación.
          </ConfigHelp>
          <ConfigHelp>
            Actual: <strong>{maxPending !== null ? maxPending : 'N/D'}</strong>
          </ConfigHelp>
          <ConfigRow>
            <ConfigInput
              id="max-pending"
              type="number"
              min={1}
              value={maxPendingInput}
              onChange={e => setMaxPendingInput(e.target.value)}
            />
            <ConfigButton onClick={handleSaveSettings} disabled={savingSettings || maxPending === null}>
              {savingSettings ? 'Guardando…' : 'Guardar'}
            </ConfigButton>
          </ConfigRow>
        </ConfigCard>
      </DashboardContent>
    </DashboardOuter>
  );
}
