import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { getProposals, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { useUserContext } from '../../context/useUserContext';
import { toastError } from '../../utils/toast';
import {
  PageContainer, Header, BackButton, Title,
  TabNav, TabButton, ProposalList, ProposalCard,
  ProposalInfo, ProposalTitle, ProposalDetail,
  CardRight, StatusBadge, ActionButtons, AcceptButton, RejectButton,
  EmptyMessage,
} from './ProposalsPage.styles';
import { ProposalStatus } from '../../interfaces/proposals/ProposalStatus';

const STATUS_LABEL: Record<ProposalStatus, string> = {
  PENDIENTE: 'Pendiente',
  ACEPTADA:  'Aceptada',
  RECHAZADA: 'Rechazada',
};

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [received, setReceived] = useState<Proposal[]>([]);
  const [sent, setSent] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [rec, env] = await Promise.all([
        getProposals(currentUser.id),
        getProposals('', currentUser.id),
      ]);
      setReceived(rec);
      setSent(env);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const handleAccept = async (proposal: Proposal) => {
    setActionLoading(proposal.id);
    try {
      await acceptProposal(proposal.id, currentUser.id);
      setReceived(prev =>
        prev.map(p => p.id === proposal.id ? { ...p, status: 'ACEPTADA' } : p)
      );
    } catch {
      toastError('Error al aceptar la propuesta. Intentá de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposal: Proposal) => {
    setActionLoading(proposal.id);
    try {
      await rejectProposal(proposal.id, currentUser.id);
      setReceived(prev =>
        prev.map(p => p.id === proposal.id ? { ...p, status: 'RECHAZADA' } : p)
      );
    } catch {
      toastError('Error al rechazar la propuesta. Intentá de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const list = tab === 'received' ? received : sent;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/profile/${currentUser.id}`)} title="Volver al perfil">
          ←
        </BackButton>
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
        <EmptyMessage>Cargando propuestas...</EmptyMessage>
      ) : list.length === 0 ? (
        <EmptyMessage>No hay propuestas {tab === 'received' ? 'recibidas' : 'enviadas'}.</EmptyMessage>
      ) : (
        <ProposalList>
          {list.map(p => (
            <ProposalCard key={p.id}>
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
                  Ofrece: {p.offeredCards.map(f => `#${f.number} ${f.description}`).join(', ')}
                </ProposalDetail>
              </ProposalInfo>

              <CardRight>
                <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>

                {tab === 'received' && p.status === 'PENDIENTE' && (
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
                )}
              </CardRight>
            </ProposalCard>
          ))}
        </ProposalList>
      )}
    </PageContainer>
  );
}
