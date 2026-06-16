import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';
import { useSnackbar } from '../../context/useSnackbar';
import { getSettings, updateSettings } from '../../api/SettingsService';
import { sendBroadcast } from '../../api/BroadcastService';
import {
  getAdminOverview, AdminOverview,
  getAuctionsTimeseries, getProposalsTimeseries, getExchangesTimeseries,
  getMostWantedCards, getTopExchangedCards, getTopAuctionByOffers,
  MostWantedCardEntry, TopExchangedCardEntry, TopAuctionByOffersEntry,
  StatsPeriod, Timeseries,
} from '../../api/AdminStatsService';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
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
  ConfigTextarea,
  TimeseriesGrid,
  TimeseriesCard,
  TimeseriesTitle,
  TimeseriesTotal,
  PeriodToggleGroup,
  PeriodToggleButton,
  HighlightList,
  HighlightItem,
  HighlightItemLabel,
  HighlightItemCount,
  HighlightEmpty,
  HighlightCallout,
  HighlightCalloutTitle,
  HighlightCalloutSubtitle,
  HighlightCalloutCount,
} from './AdminDashboardPage.styles';

const BROADCAST_MAX_LENGTH = 2000;
const PERIOD_LABEL: Record<StatsPeriod, string> = { day: 'Día', week: 'Semana', month: 'Mes' };
const PERIODS: StatsPeriod[] = ['day', 'week', 'month'];

interface TimeseriesPanelProps {
  label: string;
  loader: (period: StatsPeriod) => Promise<Timeseries>;
}

// Capa 2: dropdown independiente por métrica. Cada panel mantiene su propio period.
function TimeseriesPanel({ label, loader }: TimeseriesPanelProps) {
  const [period, setPeriod] = useState<StatsPeriod>('week');
  const [data, setData] = useState<Timeseries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loader(period)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [loader, period]);

  return (
    <TimeseriesCard>
      <TimeseriesTitle>{label}</TimeseriesTitle>
      <TimeseriesTotal>
        {loading ? '…' : data ? data.total.toLocaleString('es-AR') : 'N/D'}
      </TimeseriesTotal>
      <PeriodToggleGroup role="group" aria-label={`Período de ${label}`}>
        {PERIODS.map(p => (
          <PeriodToggleButton key={p} $active={p === period} onClick={() => setPeriod(p)}>
            {PERIOD_LABEL[p]}
          </PeriodToggleButton>
        ))}
      </PeriodToggleGroup>
    </TimeseriesCard>
  );
}

// Capa 3: cards de highlights (top-N). Backend cachea con TTL 5min, así que aún si N admins
// abren el dashboard en simultáneo sólo dispara 1 aggregation por ventana.

function MostWantedCardsPanel() {
  const [data, setData] = useState<MostWantedCardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMostWantedCards(7).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);
  return (
    <TimeseriesCard>
      <TimeseriesTitle>Más buscadas en faltantes — últimos 7 días</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data || data.length === 0
          ? <HighlightEmpty>Sin datos en el período.</HighlightEmpty>
          : (
            <HighlightList>
              {data.map(e => (
                <HighlightItem key={e.cardId}>
                  <HighlightItemLabel>
                    <b>{e.cardId}</b> · {e.cardDescription}
                  </HighlightItemLabel>
                  <HighlightItemCount>{e.userCount}</HighlightItemCount>
                </HighlightItem>
              ))}
            </HighlightList>
          )}
    </TimeseriesCard>
  );
}

function TopExchangedCardsPanel() {
  const [data, setData] = useState<TopExchangedCardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopExchangedCards(7).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);
  return (
    <TimeseriesCard>
      <TimeseriesTitle>Cartas más intercambiadas — últimos 7 días</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data || data.length === 0
          ? <HighlightEmpty>Sin intercambios en el período.</HighlightEmpty>
          : (
            <HighlightList>
              {data.map(e => (
                <HighlightItem key={e.cardId}>
                  <HighlightItemLabel>
                    <b>{e.cardId}</b> · {e.cardDescription}
                  </HighlightItemLabel>
                  <HighlightItemCount>{e.occurrences}</HighlightItemCount>
                </HighlightItem>
              ))}
            </HighlightList>
          )}
    </TimeseriesCard>
  );
}

function TopAuctionPanel() {
  const [data, setData] = useState<TopAuctionByOffersEntry | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopAuctionByOffers().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);
  return (
    <TimeseriesCard>
      <TimeseriesTitle>Subasta con más ofertas pendientes</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data
          ? <HighlightEmpty>No hay subastas activas con ofertas.</HighlightEmpty>
          : (
            <HighlightCallout>
              <HighlightCalloutCount>{data.pendingOffers}</HighlightCalloutCount>
              <HighlightCalloutTitle><b>{data.cardId}</b> · {data.cardDescription}</HighlightCalloutTitle>
              <HighlightCalloutSubtitle>
                Subastada por {data.publisherName} · {data.totalOffers} oferta{data.totalOffers === 1 ? '' : 's'} en total
              </HighlightCalloutSubtitle>
            </HighlightCallout>
          )}
    </TimeseriesCard>
  );
}

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
