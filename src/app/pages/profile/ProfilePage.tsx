import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/auth/User';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { MissingCard } from '../../interfaces/cards/MissingCard';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { Publication } from '../../interfaces/publications/Publication';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { getUserCollection, getUserMissingCards, addToUserCollection } from '../../api/UsersService';
import { getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import { getProposals } from '../../api/ProposalsService';
import { getMyPublications } from '../../api/PublicationsService';
import { getExchangesByUserId } from '../../api/ExchangesService';
import { viewAs } from '../../utils/exchangeView';
import { useUserContext } from '../../context/useUserContext';
import {
  ProfileContainer, ProfileHeader, ProfileTitle, ProfileEmail,
  TabSection, TabNav, TabButton,
  SectionHeader, SectionTitle, SeeAllLink, RowList,
  StatusBadge, Divider,
  CompactAuctionCard, AuctionText, AuctionStatus,
  PublicationStatusBadge,
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
  EmptyMessage,
} from '../../components/collection/Collection.styles';
import { formatTimeAgo } from '../../utils/utils';

const STATUS_LABEL = { PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada' } as const;
const PUBLICATION_STATUS_LABEL = { ACTIVA: 'Activa', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' } as const;
const ORIGIN_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' } as const;
const PREVIEW = 3;

type Tab = 'collection' | 'faltantes' | 'publicaciones' | 'propuestas' | 'subastas' | 'intercambios';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const user: User = currentUser;

  const [activeTab, setActiveTab] = useState<Tab>('collection');
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [faltantes, setFaltantes] = useState<MissingCard[]>([]);
  const [recibidas, setRecibidas] = useState<Proposal[]>([]);
  const [enviadas, setEnviadas] = useState<Proposal[]>([]);
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [misSubastas, setMisSubastas] = useState<Auction[]>([]);
  const [misOfertas, setMisOfertas] = useState<UserBid[]>([]);
  const [intercambios, setIntercambios] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddMissingModal, setShowAddMissingModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [exchangeDetail, setExchangeDetail] = useState<Exchange | null>(null);
  const [proposalDetail, setProposalDetail] = useState<Proposal | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getUserCollection(user.id),
      getUserMissingCards(user.id),
      getProposals(user.id), // Recibidas -> publisherId = el usuario (hizo la publicación)
      getProposals('', user.id), // Enviadas -> postorId = el usuario (hizo la propuesta)
      getMyPublications(user.id),
      getAuctionsByUserId(user.id),
      getAuctionBidsByUserId(user.id),
      getExchangesByUserId(user.id),
    ])
      .then(([col, falt, rec, env, pubs, sub, bids, exch]) => {
        setCollection(col);
        setFaltantes(falt);
        setRecibidas(rec);
        setEnviadas(env);
        setPublicaciones(pubs);
        setMisSubastas(sub);
        setMisOfertas(bids);
        setIntercambios(exch);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user.id]);

  const loadUserMissingCards = async () => {
    getUserMissingCards(user.id).then(missing => setFaltantes(missing));
  };

  const handleRemoveMissingCard = async (cardId: string) => {
    // "Ya la conseguí" = agregar a colección. La entity del BE limpia missingCards
    // automáticamente al hacer addToCollection (idempotente).
    try {
      await addToUserCollection(user.id, cardId);
      await loadUserMissingCards();
    } catch (err) {
      console.error('Error al agregar la figurita a la colección:', err);
    }
  };

  const loadUserPublications = async () => {
    getMyPublications(user.id).then(setPublicaciones);
  };

  const isAuctionActive = (a: Auction) => new Date(a.endDate) > new Date();

  return (
    <ProfileContainer>
      <ProfileHeader>
        <img
          src="/assets/user-svgrepo-com.svg"
          alt={user.name}
          style={{ width: '48px', height: '48px', marginRight: '1rem' }}
        />
        <div>
          <ProfileTitle>{user.name}</ProfileTitle>
          <ProfileEmail>{user.email}</ProfileEmail>
        </div>
      </ProfileHeader>

      <TabSection>
        <TabNav>
          <TabButton $active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
            Mi Colección
          </TabButton>
          <TabButton $active={activeTab === 'faltantes'} onClick={() => setActiveTab('faltantes')}>
            Faltantes {!loading && `(${faltantes.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'publicaciones'} onClick={() => setActiveTab('publicaciones')}>
            Publicaciones {!loading && `(${publicaciones.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'propuestas'} onClick={() => setActiveTab('propuestas')}>
            Propuestas {!loading && `(${recibidas.length + enviadas.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'subastas'} onClick={() => setActiveTab('subastas')}>
            Subastas {!loading && `(${misSubastas.length + misOfertas.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'intercambios'} onClick={() => setActiveTab('intercambios')}>
            Intercambios {!loading && `(${intercambios.length})`}
          </TabButton>
        </TabNav>

        {loading ? (
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
                  <EmptyMessage>No tienes figuritas faltantes.</EmptyMessage>
                ) : (
                  <CollectionContainer>
                    {faltantes.map(card => (
                      <CardItem key={card.cardId}>
                        <h4>#{card.number}</h4>
                        <p><strong>{card.description}</strong></p>
                        <p>{card.country} - {card.team}</p>
                        <p>{card.category}</p>
                        {card.addedAt && (
                          <p><small>Buscás esta {formatTimeAgo(card.addedAt)}</small></p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMissingCard(card.cardId)}
                          title="Ya la conseguí"
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            background: 'transparent',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          ✓ Ya la conseguí
                        </button>
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
                      <CompactAuctionCard key={pub.id} onClick={() => navigate(`/publications/${pub.id}`)}>
                        <AuctionText>
                          <strong>#{pub.card.number} {pub.card.description}</strong>
                          {' — '}quedan {pub.remainingCount} de {pub.initialCount}
                        </AuctionText>
                        <PublicationStatusBadge $status={pub.status}>
                          {PUBLICATION_STATUS_LABEL[pub.status]}
                        </PublicationStatusBadge>
                      </CompactAuctionCard>
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
                  <EmptyMessage>No hay propuestas recibidas.</EmptyMessage>
                ) : (
                  <RowList>
                    {recibidas.slice(0, PREVIEW).map(p => (
                      <CompactAuctionCard key={p.id} onClick={() => setProposalDetail(p)}>
                        <AuctionText>
                          <strong>#{p.publication.card.number} {p.publication.card.description}</strong>
                          {' — '}de {p.bidder.name}
                        </AuctionText>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </CompactAuctionCard>
                    ))}
                    {recibidas.length > PREVIEW && (
                      <SeeAllLink onClick={() => navigate('/proposals')} style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                        +{recibidas.length - PREVIEW} más
                      </SeeAllLink>
                    )}
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
                  <EmptyMessage>No hay propuestas enviadas.</EmptyMessage>
                ) : (
                  <RowList>
                    {enviadas.slice(0, PREVIEW).map(p => (
                      <CompactAuctionCard key={p.id} onClick={() => setProposalDetail(p)}>
                        <AuctionText>
                          <strong>#{p.publication.card.number} {p.publication.card.description}</strong>
                          {' — '}a {p.publication.publisher.name}
                        </AuctionText>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </CompactAuctionCard>
                    ))}
                    {enviadas.length > PREVIEW && (
                      <SeeAllLink onClick={() => navigate('/proposals')} style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                        +{enviadas.length - PREVIEW} más
                      </SeeAllLink>
                    )}
                  </RowList>
                )}
              </>
            )}

            {/* Subastas */}
            {activeTab === 'subastas' && (
              <>
                <SectionHeader>
                  <SectionTitle>Mis Subastas ({misSubastas.length})</SectionTitle>
                  {misSubastas.length > PREVIEW && (
                    <SeeAllLink onClick={() => navigate('/auctions')}>Ver todas →</SeeAllLink>
                  )}
                </SectionHeader>
                {misSubastas.length === 0 ? (
                  <EmptyMessage>No tenés subastas publicadas</EmptyMessage>
                ) : (
                  <RowList>
                    {misSubastas.slice(0, PREVIEW).map(a => (
                      <CompactAuctionCard key={a.id} onClick={() => navigate(`/auctions/${a.id}`)}>
                        <AuctionText>
                          <strong>#{a.figurita.number} {a.figurita.description}</strong>
                          {' — '}cierra {new Date(a.endDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </AuctionText>
                        <AuctionStatus $active={isAuctionActive(a)}>
                          {isAuctionActive(a) ? 'Activa' : 'Cerrada'}
                        </AuctionStatus>
                      </CompactAuctionCard>
                    ))}
                    {misSubastas.length > PREVIEW && (
                      <SeeAllLink onClick={() => navigate('/auctions')} style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                        +{misSubastas.length - PREVIEW} más
                      </SeeAllLink>
                    )}
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
                  <EmptyMessage>No realizaste ofertas en subastas</EmptyMessage>
                ) : (
                  <RowList>
                    {misOfertas.slice(0, PREVIEW).map(o => (
                      <CompactAuctionCard key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
                        <AuctionText>
                          <strong>#{o.figurita.number} {o.figurita.description}</strong>
                          {' — de '}{o.publisher.name}
                          {' — '}cierra {new Date(o.closingDate).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </AuctionText>
                        <AuctionStatus $active={o.auctionStatus === 'ACTIVA'}>
                          {o.auctionStatus === 'ACTIVA' ? 'Activa' : 'Cerrada'}
                        </AuctionStatus>
                      </CompactAuctionCard>
                    ))}
                    {misOfertas.length > PREVIEW && (
                      <SeeAllLink onClick={() => navigate('/auctions')} style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                        +{misOfertas.length - PREVIEW} más →
                      </SeeAllLink>
                    )}
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
                      const headline = v.theirCards[0];
                      return (
                        <CompactAuctionCard key={ex.id} onClick={() => setExchangeDetail(ex)}>
                          <AuctionText>
                            {headline
                              ? <><strong>#{headline.number} {headline.description}</strong>{v.theirCards.length > 1 && ` (+${v.theirCards.length - 1})`}</>
                              : <strong>Intercambio</strong>
                            }
                            {' — con '}{v.other.name}
                            {' — '}{new Date(ex.createdAt).toLocaleDateString('es-AR')}
                            {' · '}{ORIGIN_LABEL[ex.origin.type]}
                          </AuctionText>
                          <AuctionStatus $active={!!v.myFeedback}>
                            {v.myFeedback ? '✓ Calificado' : 'Pendiente'}
                          </AuctionStatus>
                        </CompactAuctionCard>
                      );
                    })}
                    {intercambios.length > PREVIEW && (
                      <SeeAllLink onClick={() => navigate('/exchanges')} style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                        +{intercambios.length - PREVIEW} más
                      </SeeAllLink>
                    )}
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
          onSuccess={loadUserMissingCards}
        />
      )}

      {showPublishModal && (
        <PublishCardModal
          userId={user.id}
          onClose={() => setShowPublishModal(false)}
          onSuccess={loadUserPublications}
        />
      )}

      {proposalDetail && (
        <ProposalDetailModal
          proposal={proposalDetail}
          onClose={() => setProposalDetail(null)}
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
