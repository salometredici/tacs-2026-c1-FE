import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Publication } from '../../interfaces/publications/Publication';
import { getMyPublications, cancelPublication } from '../../api/PublicationsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useFetch } from '../../hooks/useFetch';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import {
  PageContainer, Header, Title,
  TabNav, TabButton, ListContainer, ListCard,
  ListCardInfo, ListCardTitle, ListCardDetail,
  CardRight, ActionButtons, RejectButton,
} from '../../components/common/styles/listPage.styles';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import BackButton from '../../components/common/BackButton';
import {
  PUBLICATION_STATUS_LABEL as STATUS_LABEL,
  PUBLICATION_STATUS_TONE as STATUS_TONE,
} from '../../interfaces/publications/publicationTypes';

export default function PublicationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showError, showSuccess } = useSnackbar();

  const [tab, setTab] = useState<'active' | 'all'>('active');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pendingCancel, setPendingCancel] = useState<Publication | null>(null);

  const { data, isLoading, error, setData } = useFetch(
    () => getMyPublications(currentUser.id), [currentUser.id],
  );
  const publications = data ?? [];
  const active = publications.filter(p => p.status === 'ACTIVA');
  const list = tab === 'active' ? active : publications;

  const confirmCancel = async () => {
    if (!pendingCancel) return;
    const pub = pendingCancel;
    setPendingCancel(null);
    setActionLoading(pub.id);
    try {
      await cancelPublication(pub.id, currentUser.id);
      setData(prev => prev.map(p => p.id === pub.id ? { ...p, status: 'CANCELADA' } : p));
      showSuccess('Publicación cancelada');
    } catch {
      showError('Error al cancelar la publicación. Intentá nuevamente.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/profile/${currentUser.id}`)} ariaLabel="Volver al perfil" />
        <Title>Mis Publicaciones</Title>
      </Header>

      <TabNav>
        <TabButton $active={tab === 'active'} onClick={() => setTab('active')}>
          Activas {!isLoading && `(${active.length})`}
        </TabButton>
        <TabButton $active={tab === 'all'} onClick={() => setTab('all')}>
          Todas {!isLoading && `(${publications.length})`}
        </TabButton>
      </TabNav>

      {isLoading ? (
        <EmptyState>Cargando publicaciones...</EmptyState>
      ) : error ? (
        <EmptyState>Ocurrió un error al cargar las publicaciones. Intentá de nuevo más tarde.</EmptyState>
      ) : list.length === 0 ? (
        <EmptyState>No tenés publicaciones {tab === 'active' ? 'activas' : ''}.</EmptyState>
      ) : (
        <ListContainer>
          {list.map(pub => (
            <ListCard key={pub.id} onClick={() => navigate(`/publications/${pub.id}`)}>
              <ListCardInfo>
                <ListCardTitle><b>{pub.card.id}</b> · {pub.card.description}</ListCardTitle>
                <ListCardDetail>
                  Quedan <strong>{pub.remainingCount}</strong> de <strong>{pub.initialCount}</strong> disponibles
                </ListCardDetail>
              </ListCardInfo>

              <CardRight>
                <StatusBadge tone={STATUS_TONE[pub.status]}>{STATUS_LABEL[pub.status]}</StatusBadge>
                {pub.status === 'ACTIVA' && (
                  <ActionButtons>
                    <RejectButton
                      disabled={actionLoading === pub.id}
                      onClick={e => { e.stopPropagation(); setPendingCancel(pub); }}
                    >
                      Cancelar
                    </RejectButton>
                  </ActionButtons>
                )}
              </CardRight>
            </ListCard>
          ))}
        </ListContainer>
      )}

      <ConfirmDialog
        open={pendingCancel !== null}
        title="¿Cancelar esta publicación?"
        message="Las propuestas pendientes serán canceladas también."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        destructive
        onConfirm={confirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </PageContainer>
  );
}
