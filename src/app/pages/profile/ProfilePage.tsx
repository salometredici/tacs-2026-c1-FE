import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/auth/User';
import { FiguritaColeccion } from '../../interfaces/figuritas/FiguritaColeccion';
import { MissingCard } from '../../interfaces/figuritas/MissingCard';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { getUserCollection, getUserMissingCards } from '../../api/UsersService';
import { getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import { getProposals } from '../../api/ProposalsService';
import { useUserContext } from '../../context/useUserContext';
import {
  ProfileContainer, ProfileHeader, ProfileTitle, ProfileEmail,
  TabSection, TabNav, TabButton, AddButton,
  SectionHeader, SectionTitle, SeeAllLink, RowList,
  ProposalRow, ProposalText, StatusBadge, Divider,
  CompactAuctionCard, AuctionText, AuctionStatus,
} from './ProfilePage.styles';
import Collection from '../../components/collection/Collection';
import AddMissingCardsModal from '../../components/figuritas/AddMissingCardsModal';
import {
  CollectionContainer,
  FiguritaCard,
  EmptyMessage,
} from '../../components/collection/Collection.styles';

const STATUS_LABEL = { PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada' } as const;
const PREVIEW = 3;

type Tab = 'collection' | 'faltantes' | 'propuestas' | 'subastas';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const user: User = currentUser;

  const [activeTab, setActiveTab] = useState<Tab>('collection');
  const [collection, setCollection] = useState<FiguritaColeccion[]>([]);
  const [faltantes, setFaltantes] = useState<MissingCard[]>([]);
  const [recibidas, setRecibidas] = useState<Proposal[]>([]);
  const [enviadas, setEnviadas] = useState<Proposal[]>([]);
  const [misSubastas, setMisSubastas] = useState<Auction[]>([]);
  const [misOfertas, setMisOfertas] = useState<UserBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAddMissingModal, setShowAddMissingModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getUserCollection(user.id),
      getUserMissingCards(user.id),
      getProposals(user.id), // Recibidas -> publisherId = el usuario (hizo la publicación)
      getProposals('', user.id), // Enviadas -> postorId = el usuario (hizo la propuesta)
      getAuctionsByUserId(user.id),
      getAuctionBidsByUserId(user.id),
    ])
      .then(([col, falt, rec, env, sub, bids]) => {
        setCollection(col);
        setFaltantes(falt);
        setRecibidas(rec);
        setEnviadas(env);
        setMisSubastas(sub);
        setMisOfertas(bids);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user.id]);

  const loadUserMissingCards = async () => {
    getUserMissingCards(user.id).then(missing => setFaltantes(missing));
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
          <TabButton $active={activeTab === 'propuestas'} onClick={() => setActiveTab('propuestas')}>
            Propuestas {!loading && `(${recibidas.length + enviadas.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'subastas'} onClick={() => setActiveTab('subastas')}>
            Subastas {!loading && `(${misSubastas.length + misOfertas.length})`}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <AddButton onClick={() => setShowAddMissingModal(true)}>
                    + Agregar Faltantes
                  </AddButton>
                </div>
                {faltantes.length === 0 ? (
                  <EmptyMessage>No tienes figuritas faltantes.</EmptyMessage>
                ) : (
                  <CollectionContainer>
                    {faltantes.map(figurita => (
                      <FiguritaCard key={figurita.figuritaId}>
                        <h4>#{figurita.number}</h4>
                        <p><strong>{figurita.description}</strong></p>
                        <p>{figurita.country} - {figurita.team}</p>
                        <p>{figurita.category}</p>
                      </FiguritaCard>
                    ))}
                  </CollectionContainer>
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
                      <ProposalRow key={p.id}>
                        <ProposalText>
                          <strong>#{p.publication.figurita.number} {p.publication.figurita.description}</strong>
                          {' — '}de {p.bidder.name}
                        </ProposalText>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </ProposalRow>
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
                      <ProposalRow key={p.id}>
                        <ProposalText>
                          <strong>#{p.publication.figurita.number} {p.publication.figurita.description}</strong>
                          {' — '}a {p.publication.publisher.name}
                        </ProposalText>
                        <StatusBadge $estado={p.status}>{STATUS_LABEL[p.status]}</StatusBadge>
                      </ProposalRow>
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
    </ProfileContainer>
  );
}
