import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Publication } from '../../interfaces/publications/Publication';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';
import { getPublicationById, cancelPublication } from '../../api/PublicationsService';
import { getProposalsByPublicationId, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { useUserContext } from '../../context/useUserContext';
import { useSnackbar } from '../../context/useSnackbar';
import MakeProposalModal from '../../components/proposals/MakeProposalModal';
import {
  PageContainer, Header, BackButton, Title,
  PublicationCard, TopRow, CardInfo, CardTitle, CardMeta, StatusBadge,
  CountSection, CountLabel, CountValue, ProgressTrack, ProgressFill,
  PublisherRow, PublisherAvatar,
  Actions, PrimaryButton, DangerOutlineButton,
  SectionTitle, ProposalList, ProposalCard, ProposalInfo, ProposalTitleRow, ProposalTitle, ProposalDetail,
  VerticalDivider, ProposalStatusBadge, ActionButtons, AcceptButton, RejectButton,
  EmptyMessage,
} from './PublicationDetailPage.styles';

const PUB_STATUS_LABEL = { ACTIVA: 'Activa', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' } as const;
const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada'
};

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const { showError } = useSnackbar();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getPublicationById(id, currentUser?.id),
      getProposalsByPublicationId(id),
    ])
      .then(([pub, props]) => {
        setPublication(pub);
        setProposals(props);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!currentUser) { navigate('/login'); return null; }

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)} aria-label="Volver">
            <span className="material-symbols-outlined">arrow_back</span>
          </BackButton>
          <Title>Cargando publicación...</Title>
        </Header>
      </PageContainer>
    );
  }

  if (!publication) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)} aria-label="Volver">
            <span className="material-symbols-outlined">arrow_back</span>
          </BackButton>
          <Title>Publicación no encontrada</Title>
        </Header>
        <EmptyMessage>La publicación no existe o fue eliminada.</EmptyMessage>
      </PageContainer>
    );
  }

  const isOwner = publication.publisher.id === currentUser.id;
  const isActive = publication.status === 'ACTIVA';
  const consumedPct = publication.initialCount > 0
    ? ((publication.initialCount - publication.remainingCount) / publication.initialCount) * 100
    : 0;
  const pendingProposals = proposals.filter(p => p.status === 'PENDIENTE');

  const reload = async () => {
    if (!id) return;
    const [pub, props] = await Promise.all([
      getPublicationById(id, currentUser?.id),
      getProposalsByPublicationId(id),
    ]);
    setPublication(pub);
    setProposals(props);
  };

  const handleCancel = async () => {
    if (!publication) return;
    if (!confirm('¿Cancelar esta publicación? Las propuestas pendientes serán canceladas también.')) return;
    setCancelling(true);
    try {
      await cancelPublication(publication.id, currentUser.id);
      // Optimistic local update; el BE eventualmente lo refleja
      setPublication({ ...publication, status: 'CANCELADA' });
      setProposals(prev => prev.map(p =>
        p.status === 'PENDIENTE' ? { ...p, status: 'RECHAZADA' } : p
      ));
    } catch {
      showError('Error al cancelar la publicación. Intentá nuevamente.');
    } finally {
      setCancelling(false);
    }
  };

  const handleAccept = async (proposal: Proposal) => {
    if (!publication) return;
    if (proposal.requestedCount > publication.remainingCount) {
      showError(`Esta propuesta pide ${proposal.requestedCount} pero quedan ${publication.remainingCount}.`);
      return;
    }
    setActionLoading(proposal.id);
    try {
      await acceptProposal(proposal.id, currentUser.id);
      // Optimistic: descontar requestedCount al remainingCount; si llega a 0 → FINALIZADA
      // y rechazar pendientes restantes.
      const newRemaining = Math.max(0, publication.remainingCount - proposal.requestedCount);
      const finalized = newRemaining === 0;
      setPublication({
        ...publication,
        remainingCount: newRemaining,
        status: finalized ? 'FINALIZADA' : publication.status,
      });
      setProposals(prev => prev.map(p => {
        if (p.id === proposal.id) return { ...p, status: 'ACEPTADA' };
        if (finalized && p.status === 'PENDIENTE') return { ...p, status: 'RECHAZADA' };
        return p;
      }));
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
      setProposals(prev => prev.map(p => p.id === proposal.id ? { ...p, status: 'RECHAZADA' } : p));
    } catch {
      showError('Error al rechazar la propuesta. Intentá nuevamente.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)} aria-label="Volver">
          <span className="material-symbols-outlined">arrow_back</span>
        </BackButton>
        <Title>Detalle de publicación</Title>
      </Header>

      <PublicationCard>
        <TopRow>
          <CardInfo>
            <CardTitle>#{publication.card.number} · {publication.card.description}</CardTitle>
            <CardMeta>
              {[publication.card.country, publication.card.team, publication.card.category]
                .filter(Boolean)
                .join(' · ')}
            </CardMeta>
          </CardInfo>
          <StatusBadge $status={publication.status}>
            {PUB_STATUS_LABEL[publication.status]}
          </StatusBadge>
        </TopRow>

        <CountSection>
          <CountLabel>
            Quedan <CountValue>{publication.remainingCount}</CountValue> de{' '}
            <CountValue>{publication.initialCount}</CountValue> disponibles
          </CountLabel>
          <ProgressTrack>
            <ProgressFill $pct={consumedPct} />
          </ProgressTrack>
        </CountSection>

        {!isOwner && (
          <PublisherRow>
            <PublisherAvatar src="/assets/user-svgrepo-com.svg" alt={publication.publisher.name} />
            Publicado por <strong>{publication.publisher.name}</strong>
            {publication.publisher.rating !== null && (
              <span>· ★ {publication.publisher.rating.toFixed(1)}</span>
            )}
          </PublisherRow>
        )}

        <Actions>
          {isOwner && isActive && (
            <DangerOutlineButton onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelando...' : 'Cancelar publicación'}
            </DangerOutlineButton>
          )}
          {!isOwner && isActive && publication.remainingCount > 0 && (
            <PrimaryButton onClick={() => setShowProposeModal(true)}>
              Hacer propuesta
            </PrimaryButton>
          )}
        </Actions>
      </PublicationCard>

      {isOwner && (
        <section>
          <SectionTitle>
            Propuestas recibidas ({proposals.length}
            {pendingProposals.length > 0 && ` · ${pendingProposals.length} pendiente${pendingProposals.length !== 1 ? 's' : ''}`})
          </SectionTitle>
          {proposals.length === 0 ? (
            <EmptyMessage>Aún no hay propuestas sobre esta publicación.</EmptyMessage>
          ) : (
            <ProposalList>
              {proposals.map(p => {
                const offeredCount = p.offeredCards.length;
                const showActions = isActive && p.status === 'PENDIENTE';
                return (
                  <ProposalCard key={p.id}>
                    <ProposalInfo>
                      <ProposalTitleRow>
                        <ProposalTitle>De {p.bidder.name}</ProposalTitle>
                        <ProposalStatusBadge $status={p.status}>
                          {PROPOSAL_STATUS_LABEL[p.status]}
                        </ProposalStatusBadge>
                      </ProposalTitleRow>
                      <ProposalDetail>
                        Ofrece <strong>{offeredCount}</strong> figurita{offeredCount !== 1 ? 's' : ''}
                        {' a cambio de '}
                        <strong>{p.requestedCount}</strong> de #{publication.card.number} {publication.card.description}
                      </ProposalDetail>
                      {offeredCount > 0 && (
                        <ProposalDetail>
                          Ofrecidas: {p.offeredCards.map(c => `#${c.number} ${c.description}`).join(', ')}
                        </ProposalDetail>
                      )}
                    </ProposalInfo>
                    {showActions && (
                      <>
                        <VerticalDivider />
                        <ActionButtons>
                          <AcceptButton
                            disabled={actionLoading === p.id}
                            onClick={() => handleAccept(p)}
                          >
                            Aceptar
                          </AcceptButton>
                          <RejectButton
                            disabled={actionLoading === p.id}
                            onClick={() => handleReject(p)}
                          >
                            Rechazar
                          </RejectButton>
                        </ActionButtons>
                      </>
                    )}
                  </ProposalCard>
                );
              })}
            </ProposalList>
          )}
        </section>
      )}

      {showProposeModal && (
        <MakeProposalModal
          userId={currentUser.id}
          card={publication.card}
          publicationId={publication.id}
          maxRequestable={publication.remainingCount}
          onClose={() => setShowProposeModal(false)}
          onSuccess={() => { setShowProposeModal(false); reload(); }}
        />
      )}
    </PageContainer>
  );
}
