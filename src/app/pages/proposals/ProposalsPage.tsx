import React, { useEffect, useState } from 'react';
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

  const [tab, setTab] = useState<'recibidas' | 'enviadas'>('recibidas');
  const [recibidas, setRecibidas] = useState<Proposal[]>([]);
  const [enviadas, setEnviadas] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [rec, env] = await Promise.all([
        getProposals(currentUser.id),        // Recibidas -> publisherId = el usuario (hizo la publicación)
        getProposals('', currentUser.id),    // Enviadas -> postorId = el usuario (hizo la propuesta)
      ]);
      setRecibidas(rec);
      setEnviadas(env);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const handleAccept = async (propuesta: Proposal) => {
    setActionLoading(propuesta.id);
    try {
      await acceptProposal(propuesta.id, currentUser.id);
      setRecibidas(prev =>
        prev.map(p => p.id === propuesta.id ? { ...p, status: 'ACEPTADA' } : p)
      );
    } catch {
      toastError('Error al aceptar la propuesta. Intentá de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (propuesta: Proposal) => {
    setActionLoading(propuesta.id);
    try {
      await rejectProposal(propuesta.id, currentUser.id);
      setRecibidas(prev =>
        prev.map(p => p.id === propuesta.id ? { ...p, status: 'RECHAZADA' } : p)
      );
    } catch {
      toastError('Error al rechazar la propuesta. Intentá de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const lista = tab === 'recibidas' ? recibidas : enviadas;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(`/profile/${currentUser.id}`)} title="Volver al perfil">
          ←
        </BackButton>
        <Title>Mis Propuestas</Title>
      </Header>

      <TabNav>
        <TabButton $active={tab === 'recibidas'} onClick={() => setTab('recibidas')}>
          Recibidas {!loading && `(${recibidas.length})`}
        </TabButton>
        <TabButton $active={tab === 'enviadas'} onClick={() => setTab('enviadas')}>
          Enviadas {!loading && `(${enviadas.length})`}
        </TabButton>
      </TabNav>

{loading ? (
        <EmptyMessage>Cargando propuestas...</EmptyMessage>
      ) : lista.length === 0 ? (
        <EmptyMessage>No hay propuestas {tab === 'recibidas' ? 'recibidas' : 'enviadas'}.</EmptyMessage>
      ) : (
        <ProposalList>
          {lista.map(p => (
            <ProposalCard key={p.id}>
              <ProposalInfo>
                <ProposalTitle>
                  #{p.publicacion.figurita.number} · {p.publicacion.figurita.description}
                </ProposalTitle>
                <ProposalDetail>
                  {tab === 'recibidas'
                    ? `Propuesta de ${p.postor.name}`
                    : `Publicado por ${p.publicacion.publisher.name}`}
                </ProposalDetail>
                <ProposalDetail>
                  Ofrece: {p.offeredFiguritas.map(f => `#${f.number} ${f.description}`).join(', ')}
                </ProposalDetail>
              </ProposalInfo>

              <CardRight>
                <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>

                {tab === 'recibidas' && p.status === 'PENDIENTE' && (
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
