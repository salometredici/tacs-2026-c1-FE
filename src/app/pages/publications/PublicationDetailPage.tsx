import { useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { getPublicationById, cancelPublication } from '../../api/PublicationsService';
import { getProposalsByPublicationId, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { useUserContext } from '../../context/useUserContext';
import { useFetch } from '../../hooks/useFetch';
import MakeProposalModal from '../../components/proposals/MakeProposalModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import BackButton from '../../components/common/BackButton';
import { PageContainer, Header, Title } from './PublicationDetailPage.styles';
import PublicationSummaryCard from './detail/PublicationSummaryCard';
import ProposalsList from './detail/ProposalsList';

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { refreshCurrentUser } = useUserContext();
  const { showError, showSuccess } = useSnackbar();

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: publication, isLoading: loadingPub, setData: setPublication, refetch: refetchPub } = useFetch(
    () => getPublicationById(id!, currentUser.id), [id],
  );
  const { data: proposalsData, isLoading: loadingProps, setData: setProposals, refetch: refetchProps } = useFetch(
    () => getProposalsByPublicationId(id!), [id],
  );
  const proposals = proposalsData ?? [];
  const loading = loadingPub || loadingProps;
  const reload = () => { refetchPub(); refetchProps(); };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)} />
          <Title>Cargando publicación...</Title>
        </Header>
      </PageContainer>
    );
  }

  if (!publication) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)} />
          <Title>Publicación no encontrada</Title>
        </Header>
        <EmptyState>La publicación no existe o fue eliminada.</EmptyState>
      </PageContainer>
    );
  }

  const isOwner = publication.publisher.id === currentUser.id;
  const isActive = publication.status === 'ACTIVA';

  const handleCancel = async () => {
    if (!publication) return;
    setShowCancelConfirm(false);
    setCancelling(true);
    try {
      await cancelPublication(publication.id, currentUser.id);
      // Optimistic local update; el BE eventualmente lo refleja
      setPublication(prev => prev ? { ...prev, status: 'CANCELADA' } : prev);
      setProposals(prev => prev.map(p =>
        p.status === 'PENDIENTE' ? { ...p, status: 'CANCELADA' } : p
      ));
      showSuccess('Publicación cancelada');
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
      // Optimistic: descontar requestedCount al remainingCount; si llega a 0 → FINALIZADA.
      const newRemaining = Math.max(0, publication.remainingCount - proposal.requestedCount);
      const finalized = newRemaining === 0;
      setPublication(prev => prev ? {
        ...prev,
        remainingCount: newRemaining,
        status: finalized ? 'FINALIZADA' : prev.status,
      } : prev);
      // Cascada marketplace: las pendientes que ya no entran (piden más de lo que quedó) se
      // cancelan silenciosamente. Si finalizó (newRemaining=0), eso cubre a todas las restantes.
      setProposals(prev => prev.map(p => {
        if (p.id === proposal.id) return { ...p, status: 'ACEPTADA' };
        if (p.status === 'PENDIENTE' && p.requestedCount > newRemaining) return { ...p, status: 'CANCELADA' };
        return p;
      }));
      showSuccess(finalized ? 'Propuesta aceptada — Publicación finalizada' : 'Propuesta aceptada');
      refreshCurrentUser();
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
      showSuccess('Propuesta rechazada');
    } catch {
      showError('Error al rechazar la propuesta. Intentá nuevamente.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)} />
        <Title>Detalle de publicación</Title>
      </Header>

      <PublicationSummaryCard
        publication={publication}
        isOwner={isOwner}
        isActive={isActive}
        cancelling={cancelling}
        onCancelClick={() => setShowCancelConfirm(true)}
        onProposeClick={() => setShowProposeModal(true)}
      />

      {proposals.length > 0 && (
        <ProposalsList
          proposals={proposals}
          publication={publication}
          isOwner={isOwner}
          isActive={isActive}
          actionLoading={actionLoading}
          onAccept={handleAccept}
          onReject={handleReject}
        />
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

      <ConfirmDialog
        open={showCancelConfirm}
        title="¿Cancelar esta publicación?"
        message="Las propuestas pendientes serán canceladas también."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        destructive
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </PageContainer>
  );
}
