import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../interfaces/User';
import { Figurita } from '../../interfaces/Figurita';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import { getUserCollection, getUserMissingCards, listarRepetidas } from '../../api/UsersService';
import { useUserContext } from '../../context/useUserContext';
import {
  ProfileContainer,
  ProfileHeader,
  ProfileTitle,
  ProfileEmail,
  TabSection,
  TabNav,
  TabButton,
} from './ProfilePage.styles';
import Collection from '../../components/collection/Collection';
import {
  CollectionContainer,
  FiguritaCard,
  EmptyMessage,
} from '../../components/collection/Collection.styles';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  // Si no hay usuario logueado, redirigir a login
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const [activeTab, setActiveTab] = useState<'collection' | 'faltantes'>('collection');
  const [collection, setCollection] = useState<FiguritaColeccion[]>([]);
  const [faltantes, setFaltantes] = useState<Figurita[]>([]);
  const [repeated, setRepeated] = useState<FiguritaColeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user: User = currentUser;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    load(loadUserCollection);
    load(loadUserMissingCards);
    load(loadUserRepeatedCards);
  }

  const load = async (func: () => Promise<void>) => {
    setLoading(true);
    setError(false);
    func()
      .catch(_ => setError(true))
      .finally(() => setLoading(false));
  }
  const loadUserCollection = async () => {
    getUserCollection(user.id).then(collection => setCollection(collection))
  };

  const loadUserMissingCards = async () => {
    getUserMissingCards(user.id).then(missing => setFaltantes(missing));
  };

  const loadUserRepeatedCards = async () => {
    listarRepetidas(user.id).then(repeated => setRepeated(repeated));
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <img
          src="../../../../public/assets/user-svgrepo-com.svg"
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
          <TabButton
            active={activeTab === 'collection'}
            onClick={() => setActiveTab('collection')}
          >
            Mi Colección
          </TabButton>
          <TabButton
            active={activeTab === 'faltantes'}
            onClick={() => setActiveTab('faltantes')}
          >
            Faltantes {!loading && `(${faltantes.length})`}
          </TabButton>
        </TabNav>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <EmptyMessage>Error al cargar los datos.</EmptyMessage>
        ) : (
          <>
            {activeTab === 'collection' && (
              <Collection
                usuarioId={user.id}
                mockTodas={collection.map(fc => fc.figurita)}
                mockRepetidas={collection}
              />
            )}

            {activeTab === 'faltantes' && (
              <>
                {faltantes.length === 0 ? (
                  <EmptyMessage>No tienes figuritas faltantes.</EmptyMessage>
                ) : (
                  <CollectionContainer>
                    {faltantes.map((figurita) => (
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
          </>
        )}
      </TabSection>
    </ProfileContainer>
  );
}
