import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';
import { useSnackbar } from '../../context/useSnackbar';
import { getSettings, updateSettings } from '../../api/SettingsService';
import { sendBroadcast } from '../../api/BroadcastService';
import {
  getAdminOverview, AdminOverview,
  getAuctionsTimeseries, getProposalsTimeseries, getExchangesTimeseries,
} from '../../api/AdminStatsService';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import TimeseriesPanel from './panels/TimeseriesPanel';
import MostWantedCardsPanel from './panels/MostWantedCardsPanel';
import TopExchangedCardsPanel from './panels/TopExchangedCardsPanel';
import TopAuctionPanel from './panels/TopAuctionPanel';
import {
  DashboardOuter, DashboardHeaderBar, HeaderBrand, HeaderIcon, DashboardTitle, LogoutButton,
  DashboardContent, DashboardSubtitle, SectionTitle, ConfigSectionTitle,
  StatsGrid, StatCard, StatIcon, StatValue, StatLabel,
  ConfigCard, ConfigLabel, ConfigHelp, ConfigRow, ConfigInput, ConfigButton, ConfigTextarea,
  TimeseriesGrid,
} from './AdminDashboardPage.styles';

const BROADCAST_MAX_LENGTH = 2000;

const STAT_ITEMS = (overview: AdminOverview | null) => [
  { icon: 'group',         value: overview?.totalUsers          ?? null, label: 'Usuarios registrados'  },
  { icon: 'gavel',         value: overview?.activeAuctions      ?? null, label: 'Subastas activas'      },
  { icon: 'style',         value: overview?.activePublications  ?? null, label: 'Publicaciones activas' },
  { icon: 'swap_horiz',    value: overview?.totalExchanges      ?? null, label: 'Intercambios concretados' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { adminLogout } = useAdminContext();
  const { showSuccess, showError } = useSnackbar();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const [maxPending, setMaxPending] = useState<number | null>(null);
  const [maxPendingInput, setMaxPendingInput] = useState('');
  const [maxOffers, setMaxOffers] = useState<number | null>(null);
  const [maxOffersInput, setMaxOffersInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastConfirmOpen, setBroadcastConfirmOpen] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    getAdminOverview()
      .then(setOverview)
      .catch(() => { /* fallback en STAT_ITEMS: muestra N/D */ })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getSettings()
      .then(s => {
        setMaxPending(s.maxPendingProposals);
        setMaxPendingInput(String(s.maxPendingProposals));
        setMaxOffers(s.maxOffersPerAuction);
        setMaxOffersInput(String(s.maxOffersPerAuction));
      })
      .catch(() => { /* el banner muestra N/D */ });
  }, []);

  const handleSaveSettings = async () => {
    const pending = parseInt(maxPendingInput, 10);
    const offers = parseInt(maxOffersInput, 10);
    if (!Number.isInteger(pending) || pending < 1 || pending > 100) {
      showError('El tope de propuestas debe estar entre 1 y 100.');
      return;
    }
    if (!Number.isInteger(offers) || offers < 1 || offers > 100) {
      showError('El tope de ofertas debe estar entre 1 y 100.');
      return;
    }
    setSavingSettings(true);
    try {
      const updated = await updateSettings({ maxPendingProposals: pending, maxOffersPerAuction: offers });
      setMaxPending(updated.maxPendingProposals);
      setMaxPendingInput(String(updated.maxPendingProposals));
      setMaxOffers(updated.maxOffersPerAuction);
      setMaxOffersInput(String(updated.maxOffersPerAuction));
      showSuccess('Configuración actualizada');
    } catch {
      showError('No se pudo actualizar la configuración. Intentá de nuevo.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleConfirmBroadcast = async () => {
    const trimmed = broadcastMessage.trim();
    if (!trimmed) return;
    setSendingBroadcast(true);
    try {
      await sendBroadcast(trimmed);
      showSuccess('Notificación enviada a todos los usuarios');
      setBroadcastMessage('');
      setBroadcastConfirmOpen(false);
    } catch {
      showError('No se pudo enviar la notificación. Intentá de nuevo.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  const trimmedBroadcast = broadcastMessage.trim();
  const broadcastDisabled = trimmedBroadcast.length === 0 || trimmedBroadcast.length > BROADCAST_MAX_LENGTH;

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
          {STAT_ITEMS(overview).map(stat => (
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

        <ConfigSectionTitle>Actividad por período</ConfigSectionTitle>
        <TimeseriesGrid>
          <TimeseriesPanel label="Subastas creadas"        loader={getAuctionsTimeseries} />
          <TimeseriesPanel label="Propuestas creadas"      loader={getProposalsTimeseries} />
          <TimeseriesPanel label="Intercambios concretados" loader={getExchangesTimeseries} />
        </TimeseriesGrid>

        <ConfigSectionTitle>Destacados</ConfigSectionTitle>
        <TimeseriesGrid>
          <MostWantedCardsPanel />
          <TopExchangedCardsPanel />
          <TopAuctionPanel />
        </TimeseriesGrid>

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
              max={100}
              value={maxPendingInput}
              onChange={e => setMaxPendingInput(e.target.value)}
            />
          </ConfigRow>

          <ConfigLabel htmlFor="max-offers">Máximo de ofertas pendientes por subasta</ConfigLabel>
          <ConfigHelp>
            Tope de ofertas en estado PENDIENTE que puede recibir una subasta. Máximo 100 (las ofertas
            son embedded en el documento de la subasta).
          </ConfigHelp>
          <ConfigHelp>
            Actual: <strong>{maxOffers !== null ? maxOffers : 'N/D'}</strong>
          </ConfigHelp>
          <ConfigRow>
            <ConfigInput
              id="max-offers"
              type="number"
              min={1}
              max={100}
              value={maxOffersInput}
              onChange={e => setMaxOffersInput(e.target.value)}
            />
            <ConfigButton onClick={handleSaveSettings} disabled={savingSettings || maxPending === null || maxOffers === null}>
              {savingSettings ? 'Guardando…' : 'Guardar'}
            </ConfigButton>
          </ConfigRow>
        </ConfigCard>

        <ConfigSectionTitle>Notificación global</ConfigSectionTitle>
        <ConfigCard>
          <ConfigLabel htmlFor="broadcast-message">Mensaje para todos los usuarios</ConfigLabel>
          <ConfigHelp>
            Se envía como notificación a cada usuario con rol USER. Útil para anuncios de mantenimiento,
            cambios de funcionalidad o avisos generales.
          </ConfigHelp>
          <ConfigTextarea
            id="broadcast-message"
            placeholder="Ej: Mantenimiento programado mañana 16/06 de 23 a 24hs. Durante ese horario el sistema no estará disponible."
            maxLength={BROADCAST_MAX_LENGTH}
            value={broadcastMessage}
            onChange={e => setBroadcastMessage(e.target.value)}
          />
          <ConfigHelp>
            {trimmedBroadcast.length} / {BROADCAST_MAX_LENGTH} caracteres
          </ConfigHelp>
          <ConfigRow>
            <ConfigButton
              onClick={() => setBroadcastConfirmOpen(true)}
              disabled={broadcastDisabled || sendingBroadcast}
            >
              Enviar a todos
            </ConfigButton>
          </ConfigRow>
        </ConfigCard>

        <ConfirmDialog
          open={broadcastConfirmOpen}
          title="Enviar notificación global"
          message="Vas a enviar este mensaje a todos los usuarios. ¿Confirmás?"
          confirmLabel="Enviar"
          loadingLabel="Enviando…"
          loading={sendingBroadcast}
          onConfirm={handleConfirmBroadcast}
          onCancel={() => { if (!sendingBroadcast) setBroadcastConfirmOpen(false); }}
        />
      </DashboardContent>
    </DashboardOuter>
  );
}
