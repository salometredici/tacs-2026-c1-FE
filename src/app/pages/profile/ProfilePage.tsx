import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { User } from '../../interfaces/auth/User';
import { MissingCard } from '../../interfaces/cards/MissingCard';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { Publication } from '../../interfaces/publications/Publication';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { getUserMissingCards, addToUserCollection } from '../../api/UsersService';
import { getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import { getProposals, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { getMyPublications } from '../../api/PublicationsService';
import { getExchangesByUserId } from '../../api/ExchangesService';
import { viewAs } from '../../utils/exchangeView';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useFetch } from '../../hooks/useFetch';
import { useSnackbar } from '../../context/useSnackbar';
import {
  ProfileContainer, ProfileHeader, ProfileAvatar, ProfileTitle, ProfileEmail, ProfileMeta, ProfileMetaStar,
  TabSection, TabNav, TabButton,
  SectionHeader, SectionTitle, SeeAllLink, RowList,
  StatusBadge, Divider,
  ListItemCard, StatusIndicator,
  OutlinedListItem, PublicationStatusBadge,
  MarkAsAcquiredButton,
} from './ProfilePage.styles';
import Collection from '../../components/collection/Collection';
import AddMissingCardsModal from '../../components/cards/AddMissingCardsModal';
import PublishCardModal from '../../components/exchanges/PublishCardModal';
import ExchangeDetailModal from '../../components/exchanges/ExchangeDetailModal';
import ProposalDetailModal from '../../components/proposals/ProposalDetailModal';
import { SectionActionButton } from '../../components/auctions/Auctions.styles';
import {
  CollectionContainer,
  CardItem,
  CardImage,
  EmptyMessage,
} from '../../components/collection/Collection.styles';
import { formatTimeAgo } from '../../utils/utils';

const STATUS_LABEL = { PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada' } as const;
const PUBLICATION_STATUS_LABEL = { ACTIVA: 'Activa', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' } as const;
const AUCTION_STATUS_LABEL = { ACTIVA: 'Activa', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' } as const;
const ORIGIN_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' } as const;
const PREVIEW = 3;

type Tab = 'collection' | 'faltantes' | 'publicaciones' | 'propuestas' | 'subastas' | 'intercambios';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess, showError } = useSnackbar();
  const user: User = currentUser;

  const [activeTab, setActiveTab] = useState<Tab>('collection');
  const [showAddMissingModal, setShowAddMissingModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [exchangeDetail, setExchangeDetail] = useState<Exchange | null>(null);
  const [proposalDetail, setProposalDetail] = useState<Proposal | null>(null);

  // Carga las 7 secciones en paralelo con allSettled. Si una sola falla, el resto igual se muestra.
  // Si TODAS fallan, marcamos error global. `refetch` re-corre las 7 (lo invocan los modales de
  // crear faltante / publicar figurita, y "Ya la conseguí")
  const { data, isLoading, error, refetch } = useFetch(
    () => Promise.allSettled([
      getUserMissingCards(user.id),
      getProposals(user.id),
      getProposals('', user.id),
      getMyPublications(user.id),
      getAuctionsByUserId(user.id),
      getAuctionBidsByUserId(user.id),
      getExchangesByUserId(user.id),
    ]).then(results => {
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) throw new Error('all sections failed');
      const valueOr = <U,>(r: PromiseSettledResult<U>, fallback: U): U =>
        r.status === 'fulfilled' ? r.value : fallback;
      return {
        faltantes:     valueOr<MissingCard[]>(results[0] as PromiseSettledResult<MissingCard[]>, []),
        recibidas:     valueOr<Proposal[]>(results[1] as PromiseSettledResult<Proposal[]>, []),
        enviadas:      valueOr<Proposal[]>(results[2] as PromiseSettledResult<Proposal[]>, []),
        publicaciones: valueOr<Publication[]>(results[3] as PromiseSettledResult<Publication[]>, []),
        misSubastas:   valueOr<Auction[]>(results[4] as PromiseSettledResult<Auction[]>, []),
        misOfertas:    valueOr<UserBid[]>(results[5] as PromiseSettledResult<UserBid[]>, []),
        intercambios:  valueOr<Exchange[]>(results[6] as PromiseSettledResult<Exchange[]>, []),
      };
    }),
    [user.id],
  );
  const faltantes     = data?.faltantes     ?? [];
  const recibidas     = data?.recibidas     ?? [];
  const enviadas      = data?.enviadas      ?? [];
  const publicaciones = data?.publicaciones ?? [];
  const misSubastas   = data?.misSubastas   ?? [];
  const misOfertas    = data?.misOfertas    ?? [];
  const intercambios  = data?.intercambios  ?? [];

  const handleRemoveMissingCard = async (cardId: string) => {
    // "Ya la conseguí" = agregar a colección. La entity del BE limpia missingCards
    // automáticamente al hacer addToCollection (idempotente)
    try {
      await addToUserCollection(user.id, cardId);
      refetch();
    } catch (err) {
      console.error('Error al agregar la figurita a la colección:', err);
    }
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      await acceptProposal(proposal.id, user.id);
      showSuccess('Propuesta aceptada');
      refetch();
    } catch {
      showError('Error al aceptar la propuesta. Intentá nuevamente.');
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    try {
      await rejectProposal(proposal.id, user.id);
      showSuccess('Propuesta rechazada');
      refetch();
    } catch {
      showError('Error al rechazar la propuesta. Intentá nuevamente.');
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar src="/assets/user-svgrepo-com.svg" alt={user.name} />
        <div>
          <ProfileTitle>{user.name}</ProfileTitle>
          <ProfileEmail>{user.email}</ProfileEmail>
          <ProfileMeta>
            {user.rating != null
              ? <><ProfileMetaStar>★</ProfileMetaStar> {user.rating.toFixed(1)}</>
              : 'Sin calificaciones aún'}
            {' · '}
            {user.exchangesAmount === 0
              ? 'Sin intercambios todavía'
              : user.exchangesAmount === 1
                ? '1 intercambio'
                : `${user.exchangesAmount} intercambios`}
          </ProfileMeta>
        </div>
      </ProfileHeader>

      <TabSection>
        <TabNav>
          <TabButton $active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
            Mi Colección
          </TabButton>
          <TabButton $active={activeTab === 'faltantes'} onClick={() => setActiveTab('faltantes')}>
            Faltantes {!isLoading && `(${faltantes.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'publicaciones'} onClick={() => setActiveTab('publicaciones')}>
            Publicaciones {!isLoading && `(${publicaciones.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'propuestas'} onClick={() => setActiveTab('propuestas')}>
            Propuestas {!isLoading && `(${recibidas.length + enviadas.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'subastas'} onClick={() => setActiveTab('subastas')}>
            Subastas {!isLoading && `(${misSubastas.length + misOfertas.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'intercambios'} onClick={() => setActiveTab('intercambios')}>
            Intercambios {!isLoading && `(${intercambios.length})`}
          </TabButton>
        </TabNav>

        {isLoading ? (
          <p>Cargando...</p>
        ) : error ? (
          <EmptyMessage>Error al cargar los datos.</EmptyMessage>
        ) : (
          <>
            {/* Mi Colección */}
            {activeTab === 'collection' && (
              <Collection userId={user.id} />
            )}

            {/* Faltantes */}
            {activeTab === 'faltantes' && (
              <>
                <SectionHeader>
                  <SectionTitle>Mis faltantes ({faltantes.length})</SectionTitle>
                  <SectionActionButton onClick={() => setShowAddMissingModal(true)}>
                    <span className="material-symbols-outlined" aria-hidden="true">add</span>
                    Agregar Faltantes
                  </SectionActionButton>
                </SectionHeader>
                {faltantes.length === 0 ? (
                  <EmptyMessage>No tenés figuritas faltantes.</EmptyMessage>
                ) : (
                  <CollectionContainer>
                    {faltantes.map(card => (
                      <CardItem key={card.cardId}>
                        <CardImage $category={card.category}>
                          <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
                        </CardImage>
                        <h4>#{card.number}</h4>
                        <p><strong>{card.description}</strong></p>
                        <p>{card.country} - {card.team}</p>
                        <p>{card.category}</p>
                        {card.addedAt && (
                          <p>Buscás esta {formatTimeAgo(card.addedAt)}</p>
                        )}
                        <MarkAsAcquiredButton
                          type="button"
                          onClick={() => handleRemoveMissingCard(card.cardId)}
                          title="Ya la conseguí"
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">check</span>
                          Ya la conseguí
                        </MarkAsAcquiredButton>
                      </CardItem>
                    ))}
                  </CollectionContainer>
                )}
              </>
            )}

            {/* Publicaciones */}
            {activeTab === 'publicaciones' && (
              <>
                <SectionHeader>
                  <SectionTitle>Mis Publicaciones ({publicaciones.length})</SectionTitle>
                  <SectionActionButton onClick={() => setShowPublishModal(true)}>
                    <span className="material-symbols-outlined" aria-hidden="true">add</span>
                    Publicar Figurita
                  </SectionActionButton>
                </SectionHeader>
                {publicaciones.length === 0 ? (
                  <EmptyMessage>No tenés publicaciones realizadas.</EmptyMessage>
                ) : (
                  <RowList>
                    {publicaciones.map(pub => (
                      <OutlinedListItem key={pub.id} onClick={() => navigate(`/publications/${pub.id}`)}>
                        <div>
                          <strong>#{pub.card.number} {pub.card.description}</strong>
                          <span>Quedan {pub.remainingCount} de {pub.initialCount}</span>
                        </div>
                        <PublicationStatusBadge $status={pub.status}>
                          {PUBLICATION_STATUS_LABEL[pub.status]}
                        </PublicationStatusBadge>
                      </OutlinedListItem>
                    ))}
                  </RowList>
                )}
              </>
            )}

            {/* Propuestas */}
            {activeTab === 'propuestas' && (
              <>
                <SectionHeader>
                  <SectionTitle>Recibidas ({recibidas.length})</SectionTitle>
                  {recibidas.length > PREVIEW && (
                    <SeeAllLink onClick={() => navigate('/proposals')}>Ver todas →</SeeAllLink>
                  )}
                </SectionHeader>
                {recibidas.length === 0 ? (
                  <EmptyMessage>No tenés propuestas recibidas.</EmptyMessage>
                ) : (
                  <RowList>
                    {recibidas.slice(0, PREVIEW).map(p => (
                      <OutlinedListItem key={p.id} onClick={() => setProposalDetail(p)}>
                        <div>
                          <strong>Por {p.requestedCount}× #{p.publication.card.number} {p.publication.card.description}</strong>
                          <span>De {p.bidder.name} · Te ofrece {p.offeredCards.length} figurita{p.offeredCards.length === 1 ? '' : 's'}</span>
                        </div>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </OutlinedListItem>
                    ))}
                  </RowList>
                )}

                <Divider />

                <SectionHeader>
                  <SectionTitle>Enviadas ({enviadas.length})</SectionTitle>
                  {enviadas.length > PREVIEW && (
                    <SeeAllLink onClick={() => navigate('/proposals')}>Ver todas →</SeeAllLink>
                  )}
                </SectionHeader>
                {enviadas.length === 0 ? (
                  <EmptyMessage>No tenés propuestas enviadas.</EmptyMessage>
                ) : (
                  <RowList>
                    {enviadas.slice(0, PREVIEW).map(p => (
                      <OutlinedListItem key={p.id} onClick={() => setProposalDetail(p)}>
                        <div>
                          <strong>Por {p.requestedCount}× #{p.publication.card.number} {p.publication.card.description}</strong>
                          <span>A {p.publication.publisher.name} · Ofrecés {p.offeredCards.length} figurita{p.offeredCards.length === 1 ? '' : 's'}</span>
                        </div>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </OutlinedListItem>
                    ))}
                  </RowList>
                )}
              </>
            )}

            {/* Subastas */}
            {activeTab === 'subastas' && (
              <>
                <SectionHeader>
                  <SectionTitle>Mis Subastas ({misSubastas.length})</SectionTitle>
                  <SectionActionButton onClick={() => navigate('/auctions/create')}>
                    <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
                    Crear Subasta
                  </SectionActionButton>
                </SectionHeader>
                {misSubastas.length > PREVIEW && (
                  <SeeAllLink onClick={() => navigate('/auctions')}>Ver todas →</SeeAllLink>
                )}
                {misSubastas.length === 0 ? (
                  <EmptyMessage>No tenés subastas publicadas.</EmptyMessage>
                ) : (
                  <RowList>
                    {misSubastas.slice(0, PREVIEW).map(a => (
                      <OutlinedListItem key={a.id} onClick={() => navigate(`/auctions/${a.id}`)}>
                        <div>
                          <strong>#{a.figurita.number} {a.figurita.description}</strong>
                          <span>Cierra {new Date(a.endDate).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <StatusIndicator $active={a.status === 'ACTIVA'}>
                          {AUCTION_STATUS_LABEL[a.status]}
                        </StatusIndicator>
                      </OutlinedListItem>
                    ))}
                  </RowList>
                )}

                <Divider />

                <SectionHeader>
                  <SectionTitle>Mis Ofertas ({misOfertas.length})</SectionTitle>
                  {misOfertas.length > PREVIEW && (
                    <SeeAllLink onClick={() => navigate('/auctions')}>Ver todas →</SeeAllLink>
                  )}
                </SectionHeader>
                {misOfertas.length === 0 ? (
                  <EmptyMessage>No tenés ofertas en subastas.</EmptyMessage>
                ) : (
                  <RowList>
                    {misOfertas.slice(0, PREVIEW).map(o => (
                      <OutlinedListItem key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
                        <div>
                          <strong>#{o.figurita.number} {o.figurita.description}</strong>
                          <span>De {o.publisher.name} · Cierra {new Date(o.closingDate).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <StatusIndicator $active={o.auctionStatus === 'ACTIVA'}>
                          {o.auctionStatus === 'ACTIVA' ? 'Activa' : 'Cerrada'}
                        </StatusIndicator>
                      </OutlinedListItem>
                    ))}
                  </RowList>
                )}
              </>
            )}

            {/* Intercambios */}
            {activeTab === 'intercambios' && (
              <>
                <SectionHeader>
                  <SectionTitle>Histórico ({intercambios.length})</SectionTitle>
                  {intercambios.length > PREVIEW && (
                    <SeeAllLink onClick={() => navigate('/exchanges')}>Ver todos →</SeeAllLink>
                  )}
                </SectionHeader>
                {intercambios.length === 0 ? (
                  <EmptyMessage>No tenés intercambios concretados todavía.</EmptyMessage>
                ) : (
                  <RowList>
                    {intercambios.slice(0, PREVIEW).map(ex => {
                      const v = viewAs(ex, user.id);
                      const headlineCard = v.theirCards[0];
                      const extras = v.theirCards.length - 1;
                      const extraText = extras === 0 ? '' : extras === 1 ? ' y otra figurita' : ` y otras ${extras} figuritas`;
                      return (
                        <OutlinedListItem key={ex.id} onClick={() => setExchangeDetail(ex)}>
                          <div>
                            {headlineCard
                              ? <strong>#{headlineCard.number} {headlineCard.description}{extraText}</strong>
                              : <strong>Intercambio</strong>
                            }
                            <span>
                              Recibidas de {v.other.name} · {new Date(ex.createdAt).toLocaleDateString('es-AR')} · {ORIGIN_LABEL[ex.origin.type]}
                            </span>
                          </div>
                          <StatusIndicator $active={!!v.myFeedback}>
                            {v.myFeedback
                              ? <><span className="material-symbols-outlined" aria-hidden="true">check</span> Calificado</>
                              : 'Sin calificar'
                            }
                          </StatusIndicator>
                        </OutlinedListItem>
                      );
                    })}
                  </RowList>
                )}
              </>
            )}
          </>
        )}
      </TabSection>

      {showAddMissingModal && (
        <AddMissingCardsModal
          userId={user.id}
          onClose={() => setShowAddMissingModal(false)}
          onSuccess={refetch}
        />
      )}

      {showPublishModal && (
        <PublishCardModal
          userId={user.id}
          onClose={() => setShowPublishModal(false)}
          onSuccess={refetch}
        />
      )}

      {proposalDetail && (
        <ProposalDetailModal
          proposal={proposalDetail}
          onClose={() => setProposalDetail(null)}
          onAccept={proposalDetail.publication.publisher.id === user.id
            ? () => handleAcceptProposal(proposalDetail)
            : undefined}
          onReject={proposalDetail.publication.publisher.id === user.id
            ? () => handleRejectProposal(proposalDetail)
            : undefined}
        />
      )}

      {exchangeDetail && (
        <ExchangeDetailModal
          exchange={exchangeDetail}
          currentUserId={user.id}
          onClose={() => setExchangeDetail(null)}
        />
      )}
    </ProfileContainer>
  );
}
