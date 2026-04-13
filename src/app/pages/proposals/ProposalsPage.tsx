import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Propuesta, EstadoPropuesta } from '../../interfaces/proposals/Propuesta';
import { getReceivedProposals, getSentProposals } from '../../api/UsersService';
import { acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { useUserContext } from '../../context/useUserContext';
import { toastError } from '../../utils/toast';
import {
  PageContainer, Header, BackButton, Title,
  TabNav, TabButton, ProposalList, ProposalCard,
  ProposalInfo, ProposalTitle, ProposalDetail,
  CardRight, StatusBadge, ActionButtons, AcceptButton, RejectButton,
  EmptyMessage,
} from './ProposalsPage.styles';

const STATUS_LABEL: Record<EstadoPropuesta, string> = {
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
  const [recibidas, setRecibidas] = useState<Propuesta[]>([]);
  const [enviadas, setEnviadas] = useState<Propuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const [rec, env] = await Promise.all([
        getReceivedProposals(currentUser.id),
        getSentProposals(currentUser.id),
      ]);
      setRecibidas(rec);
      setEnviadas(env);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const handleAccept = async (propuesta: Propuesta) => {
    setActionLoading(propuesta.id);
    try {
      await acceptProposal(propuesta.publicacion.id, propuesta.id, currentUser.id);
      setRecibidas(prev =>
        prev.map(p => p.id === propuesta.id ? { ...p, estado: 'ACEPTADA' } : p)
      );
    } catch {
      toastError('Error al aceptar la propuesta. Intentá de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (propuesta: Propuesta) => {
    setActionLoading(propuesta.id);
    try {
      await rejectProposal(propuesta.publicacion.id, propuesta.id, currentUser.id);
      setRecibidas(prev =>
        prev.map(p => p.id === propuesta.id ? { ...p, estado: 'RECHAZADA' } : p)
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
                  #{p.publicacion.figurita.numero} · {p.publicacion.figurita.jugador}
                </ProposalTitle>
                <ProposalDetail>
                  {tab === 'recibidas'
                    ? `Propuesta de ${p.postor.nombre}`
                    : `Publicado por ${p.publicacion.publicante.nombre}`}
                </ProposalDetail>
                <ProposalDetail>
                  Ofrece: {p.figuritasOfrecidas.map(f => `#${f.numero} ${f.jugador}`).join(', ')}
                </ProposalDetail>
              </ProposalInfo>

              <CardRight>
                <StatusBadge $estado={p.estado}>{STATUS_LABEL[p.estado]}</StatusBadge>

                {tab === 'recibidas' && p.estado === 'PENDIENTE' && (
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
