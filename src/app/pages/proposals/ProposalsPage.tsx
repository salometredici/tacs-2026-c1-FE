import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { getProposals, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useFetch } from '../../hooks/useFetch';
import ProposalDetailModal from '../../components/proposals/ProposalDetailModal';
import {
  PageContainer, Header, Title,
  TabNav, TabButton, ProposalList, ProposalCard,
  ProposalInfo, ProposalTitle, ProposalDetail,
  CardRight, ActionButtons, AcceptButton, RejectButton,
  ViewPublicationLink,
} from './ProposalsPage.styles';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import BackButton from '../../components/common/BackButton';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';

const STATUS_LABEL: Record<ProposalStatus, string> = {
  PENDIENTE: 'Pendiente',
  ACEPTADA:  'Aceptada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada'
};
const STATUS_TONE = { PENDIENTE: 'warning', ACEPTADA: 'success', RECHAZADA: 'error', CANCELADA: 'error' } as const;

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showError, showSuccess } = useSnackbar();

  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detail, setDetail] = useState<Proposal | null>(null);

  const {
    data: receivedData, isLoading: loadingReceived, error: errorReceived, setData: setReceived,
  } = useFetch(() => getProposals(currentUser.id), [currentUser.id]);
  const {
    data: sentData, isLoading: loadingSent, error: errorSent,
  } = useFetch(() => getProposals('', currentUser.id), [currentUser.id]);

  const received = receivedData ?? [];
  const sent = sentData ?? [];
  const loading = loadingReceived || loadingSent;
  const loadError = errorReceived !== null || errorSent !== null;

  const handleAccept = async (proposal: Proposal) => {
    setActionLoading(proposal.id);
    try {
      await acceptProposal(proposal.id, currentUser.id);
      setReceived(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'ACEPTADA' } : p));
      showSuccess('Propuesta aceptada');
    } catch {
      showError('Error al aceptar la propuesta. Intentá nuevamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposal: Proposal) => {
    setActionLoading(proposal.id);
    try {
      await rejectProposal(proposal.id, currentUser.id);
      setReceived(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'RECHAZADA' } : p));
      showSuccess('Propuesta rechazada');
    } catch {
      showError('Error al rechazar la propuesta. Intentá nuevamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const list = tab === 'received' ? received : sent;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/profile/${currentUser.id}`)} ariaLabel="Volver al perfil" />
        <Title>Mis Propuestas</Title>
      </Header>

      <TabNav>
        <TabButton $active={tab === 'received'} onClick={() => setTab('received')}>
          Recibidas {!loading && `(${received.length})`}
        </TabButton>
        <TabButton $active={tab === 'sent'} onClick={() => setTab('sent')}>
          Enviadas {!loading && `(${sent.length})`}
        </TabButton>
      </TabNav>

      {loading ? (
        <EmptyState>Cargando propuestas...</EmptyState>
      ) : loadError ? (
        <EmptyState>Ocurrió un error al cargar las propuestas. Intentá de nuevo más tarde.</EmptyState>
      ) : list.length === 0 ? (
        <EmptyState>No hay propuestas {tab === 'received' ? 'recibidas' : 'enviadas'}.</EmptyState>
      ) : (
        <ProposalList>
          {list.map(p => (
            <ProposalCard key={p.id} onClick={() => setDetail(p)}>
              <ProposalInfo>
                <ProposalTitle>
                  #{p.publication.card.number} · {p.publication.card.description}
                </ProposalTitle>
                <ProposalDetail>
                  {tab === 'received'
                    ? `Propuesta de ${p.bidder.name}`
                    : `Publicado por ${p.publication.publisher.name}`}
                </ProposalDetail>
                <ProposalDetail>
                  Ofrece <strong>{p.offeredCards.length}</strong> figurita{p.offeredCards.length !== 1 ? 's' : ''}
                  {' a cambio de '}
                  <strong>{p.requestedCount}</strong> de #{p.publication.card.number}
                </ProposalDetail>
                {p.offeredCards.length > 0 && (
                  <ProposalDetail>
                    Ofrecidas: {p.offeredCards.map(f => `#${f.number} ${f.description}`).join(', ')}
                  </ProposalDetail>
                )}
                <ViewPublicationLink onClick={e => { e.stopPropagation(); navigate(`/publications/${p.publication.id}`); }}>
                  Ver publicación
                  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
                </ViewPublicationLink>
              </ProposalInfo>

              <CardRight>
                <StatusBadge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</StatusBadge>

                {tab === 'received' && p.status === 'PENDIENTE' && (
                  <ActionButtons>
                    <AcceptButton
                      disabled={actionLoading === p.id}
                      onClick={e => { e.stopPropagation(); handleAccept(p); }}
                    >
                      Aceptar
                    </AcceptButton>
                    <RejectButton
                      disabled={actionLoading === p.id}
                      onClick={e => { e.stopPropagation(); handleReject(p); }}
                    >
                      Rechazar
                    </RejectButton>
                  </ActionButtons>
                )}
              </CardRight>
            </ProposalCard>
          ))}
        </ProposalList>
      )}

      {detail && (
        <ProposalDetailModal
          proposal={detail}
          onClose={() => setDetail(null)}
          onAccept={tab === 'received' ? () => handleAccept(detail) : undefined}
          onReject={tab === 'received' ? () => handleReject(detail) : undefined}
        />
      )}
    </PageContainer>
  );
}
