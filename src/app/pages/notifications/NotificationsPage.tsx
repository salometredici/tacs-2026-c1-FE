import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Notification } from '../../interfaces/Notification';
import { getNotifications, markAsRead } from '../../api/NotificationsService';
import type { PaginatedResponse } from '../../api/NotificationsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useFetch } from '../../hooks/useFetch';
import StatusBadge from '../../components/common/StatusBadge';
import BackButton from '../../components/common/BackButton';
import EmptyState from '../../components/common/EmptyState';
import {
  PageContainer, Header, Title,
  TabNav, TabButton,
  NotificationList, NotificationCard,
  NotificationInfo, NotificationMessage, NotificationType,
  CardRight, MarkReadButton, NavigateButton,
  PaginationRow, PaginationIconButton, PageNumberButton, PageEllipsis,
} from './NotificationsPage.styles';

const TYPE_LABELS: Record<string, string> = {
  TRADE_PROPOSAL_RECEIVED: 'Propuesta de intercambio recibida',
  TRADE_PROPOSAL_ACCEPTED: 'Propuesta de intercambio aceptada',
  TRADE_PROPOSAL_REJECTED: 'Propuesta de intercambio rechazada',
  AUCTION_OFFER_RECEIVED: 'Oferta de subasta recibida',
  AUCTION_OFFER_ACCEPTED: 'Oferta de subasta aceptada',
  AUCTION_OFFER_REJECTED: 'Oferta de subasta rechazada',
  AUCTION_CANCELLED: 'Subasta cancelada',
  AUCTION_ENDING_SOON: 'Subasta por cerrar',
  WANTED_CARD_AVAILABLE_IN_AUCTION: 'Figurita buscada disponible en subasta',
  WANTED_CARD_AVAILABLE_IN_PUBLICATION: 'Figurita buscada disponible en publicación',
};

function getNavigatePath(n: Notification): string | null {
  if (n.type.startsWith('TRADE_PROPOSAL')) return '/proposals';
  if (n.type.startsWith('AUCTION_') || n.type === 'WANTED_CARD_AVAILABLE_IN_AUCTION') {
    return n.referenceId ? `/auctions/${n.referenceId}` : null;
  }
  if (n.type === 'WANTED_CARD_AVAILABLE_IN_PUBLICATION') {
    return n.referenceId ? `/publications/${n.referenceId}` : null;
  }
  return null;
}

function getNavigateLabel(n: Notification): string {
  if (n.type.startsWith('TRADE_PROPOSAL')) return 'Ir a propuestas';
  if (n.type.startsWith('AUCTION_') || n.type === 'WANTED_CARD_AVAILABLE_IN_AUCTION') return 'Ir a subasta';
  if (n.type === 'WANTED_CARD_AVAILABLE_IN_PUBLICATION') return 'Ir a publicación';
  return '';
}

function buildPageRange(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | '...'> = [1];

  if (current <= 3) {
    pages.push(2, 3, 4, '...', total);
  } else if (current >= total - 3) {
    pages.push('...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push('...', current - 1, current, current + 1, '...', total);
  }

  return pages;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showError } = useSnackbar();

  const [statusFilter, setStatusFilter] = useState<'UNREAD' | 'READ'>('UNREAD');
  const [page, setPage] = useState(1);

  const {
    data: result, isLoading, error, refetch,
  } = useFetch(
    () => getNotifications(currentUser.id, page, 20, statusFilter),
    [currentUser.id, page, statusFilter],
  );

  const notifications = result?.data ?? [];
  const totalPages = result?.totalPages ?? 1;

  useEffect(() => {
    if (result && result.data.length === 0 && page > 1) {
      setPage(1);
    }
  }, [result, page]);

  const handleFilterChange = (filter: 'UNREAD' | 'READ') => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handleMarkAsRead = async (n: Notification) => {
    try {
      await markAsRead(currentUser.id, n.id);
      refetch();
    } catch {
      showError('Error al marcar la notificación como leída.');
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/')} ariaLabel="Volver al inicio" />
        <Title>Notificaciones</Title>
      </Header>

      <TabNav>
        <TabButton $active={statusFilter === 'UNREAD'} onClick={() => handleFilterChange('UNREAD')}>
          No leídas
        </TabButton>
        <TabButton $active={statusFilter === 'READ'} onClick={() => handleFilterChange('READ')}>
          Leídas
        </TabButton>
      </TabNav>

      {isLoading ? (
        <EmptyState>Cargando notificaciones...</EmptyState>
      ) : error ? (
        <EmptyState>Ocurrió un error al cargar las notificaciones. Intentá de nuevo más tarde.</EmptyState>
      ) : notifications.length === 0 ? (
        <EmptyState>
          {statusFilter === 'UNREAD'
            ? 'No tenés notificaciones sin leer.'
            : 'No tenés notificaciones leídas.'}
        </EmptyState>
      ) : (
        <>
          <NotificationList>
            {notifications.map(n => {
              const path = getNavigatePath(n);
              return (
                <NotificationCard key={n.id}>
                  <NotificationInfo>
                    <NotificationMessage>{n.message}</NotificationMessage>
                    <NotificationType>{TYPE_LABELS[n.type] ?? n.type}</NotificationType>
                  </NotificationInfo>
                  <CardRight>
                    <StatusBadge tone={n.read ? 'neutral' : 'info'}>
                      {n.read ? 'Leída' : 'No leída'}
                    </StatusBadge>
                    {!n.read && (
                      <MarkReadButton onClick={() => handleMarkAsRead(n)}>
                        Marcar como leída
                      </MarkReadButton>
                    )}
                    {path && (
                      <NavigateButton onClick={() => navigate(path)}>
                        {getNavigateLabel(n)}
                        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                      </NavigateButton>
                    )}
                  </CardRight>
                </NotificationCard>
              );
            })}
          </NotificationList>

          {totalPages > 1 && (
            <PaginationRow>
              <PaginationIconButton
                disabled={page <= 1}
                onClick={() => setPage(1)}
                aria-label="Primera página"
              >
                <span className="material-symbols-outlined" aria-hidden="true">skip_previous</span>
              </PaginationIconButton>

              {buildPageRange(page, totalPages).map((item, idx) =>
                item === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageNumberButton
                    key={item}
                    $current={item === page}
                    data-current={item === page}
                    onClick={() => setPage(item)}
                    aria-label={`Ir a página ${item}`}
                    aria-current={item === page ? 'page' : undefined}
                  >
                    {item}
                  </PageNumberButton>
                ),
              )}

              <PaginationIconButton
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
                aria-label="Última página"
              >
                <span className="material-symbols-outlined" aria-hidden="true">skip_next</span>
              </PaginationIconButton>
            </PaginationRow>
          )}
        </>
      )}
    </PageContainer>
  );
}
