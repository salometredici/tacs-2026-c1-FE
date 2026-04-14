import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/User';
import { Figurita } from '../../interfaces/Figurita';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import { Propuesta } from '../../interfaces/proposals/Propuesta';
import { Auction } from '../../interfaces/auction/Auction';
import { getUserCollection, getUserMissingCards, getReceivedProposals, getSentProposals } from '../../api/UsersService';
import { getAuctionsByUserId } from '../../api/AuctionsService';
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

  const [activeTab, setActiveTab]       = useState<Tab>('collection');
  const [collection, setCollection]     = useState<FiguritaColeccion[]>([]);
  const [faltantes, setFaltantes]       = useState<Figurita[]>([]);
  const [recibidas, setRecibidas]       = useState<Propuesta[]>([]);
  const [enviadas, setEnviadas]         = useState<Propuesta[]>([]);
  const [misSubastas, setMisSubastas]   = useState<Auction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [showAddMissingModal, setShowAddMissingModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      getUserCollection(user.id),
      getUserMissingCards(user.id),
      getReceivedProposals(user.id),
      getSentProposals(user.id),
      getAuctionsByUserId(user.id),
    ])
      .then(([col, falt, rec, env, sub]) => {
        setCollection(col);
        setFaltantes(falt);
        setRecibidas(rec);
        setEnviadas(env);
        setMisSubastas(sub);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user.id]);

  const loadUserMissingCards = async () => {
    getUserMissingCards(user.id).then(missing => setFaltantes(missing));
  };

  const isAuctionActive = (a: Auction) => new Date(a.fechaCierre) > new Date();

  return (
    <ProfileContainer>
      <ProfileHeader>
        <img
          src="/assets/user-svgrepo-com.svg"
          alt={user.nombre}
          style={{ width: '48px', height: '48px', marginRight: '1rem' }}
        />
        <div>
          <ProfileTitle>{user.nombre}</ProfileTitle>
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
            Mis Subastas {!loading && `(${misSubastas.length})`}
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
              <Collection
                usuarioId={user.id}
                mockTodas={collection.map(fc => fc.figurita)}
                mockRepetidas={collection}
              />
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
                      <FiguritaCard key={figurita.id}>
                        <h4>#{figurita.numero}</h4>
                        <p><strong>{figurita.jugador}</strong></p>
                        <p>{figurita.seleccion} - {figurita.equipo}</p>
                        <p>{figurita.categoria}</p>
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
                          <strong>#{p.publicacion.figurita.numero} {p.publicacion.figurita.jugador}</strong>
                          {' — '}de {p.postor.nombre}
                        </ProposalText>
                        <StatusBadge $estado={p.estado}>{STATUS_LABEL[p.estado]}</StatusBadge>
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
                          <strong>#{p.publicacion.figurita.numero} {p.publicacion.figurita.jugador}</strong>
                          {' — '}a {p.publicacion.publicante.nombre}
                        </ProposalText>
                        <StatusBadge $estado={p.estado}>{STATUS_LABEL[p.estado]}</StatusBadge>
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

            {/* Mis Subastas */}
            {activeTab === 'subastas' && (
              misSubastas.length === 0 ? (
                <EmptyMessage>No tenés subastas publicadas.</EmptyMessage>
              ) : (
                <RowList>
                  {misSubastas.map(a => (
                    <CompactAuctionCard key={a.id} onClick={() => navigate(`/auctions/${a.id}`)}>
                      <AuctionText>
                        <strong>#{a.figurita.numero} {a.figurita.jugador}</strong>
                        {' — '}cierra {new Date(a.fechaCierre).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </AuctionText>
                      <AuctionStatus $active={isAuctionActive(a)}>
                        {isAuctionActive(a) ? 'Activa' : 'Cerrada'}
                      </AuctionStatus>
                    </CompactAuctionCard>
                  ))}
                </RowList>
              )
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
