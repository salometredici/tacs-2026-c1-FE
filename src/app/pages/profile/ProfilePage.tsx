import React from 'react';
import { User } from '../../interfaces/User';
import { Figurita } from '../../interfaces/Figurita';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import { listarFaltantes } from '../../api/UsersService';
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

const MOCK_USER: User = {
  id: 1,
  nombre: 'Juan Pérez',
  email: 'juan.perez@tacs.com',
};

const MOCK_TODAS: Figurita[] = [
  { id: 1,  numero: 1,  jugador: 'Emiliano Martínez', seleccion: 'Argentina', equipo: 'Aston Villa', categoria: 'EPICO' },
  { id: 5,  numero: 5,  jugador: 'Lautaro Martínez', seleccion: 'Argentina', equipo: 'Inter de Milán', categoria: 'EPICO' },
  { id: 8,  numero: 8,  jugador: 'Jude Bellingham', seleccion: 'Inglaterra', equipo: 'Real Madrid', categoria: 'EPICO' },
  { id: 14, numero: 14, jugador: 'Gavi', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
  { id: 21, numero: 21, jugador: 'Bukayo Saka', seleccion: 'Inglaterra', equipo: 'Arsenal', categoria: 'COMUN' },
  { id: 22, numero: 22, jugador: 'Rodri', seleccion: 'España', equipo: 'Manchester City', categoria: 'COMUN' },
  { id: 30, numero: 30, jugador: 'Rafael Leão', seleccion: 'Portugal', equipo: 'AC Milan', categoria: 'COMUN' },
  { id: 33, numero: 33, jugador: 'Rúben Dias', seleccion: 'Portugal', equipo: 'Manchester City', categoria: 'COMUN' },
];

const MOCK_REPETIDAS: FiguritaColeccion[] = [
  {
    id: 101,
    figurita: { id: 5, numero: 5, jugador: 'Lautaro Martínez', seleccion: 'Argentina', equipo: 'Inter de Milán', categoria: 'EPICO' },
    cantidad: 3,
    enVenta: true,
  },
  {
    id: 102,
    figurita: { id: 22, numero: 22, jugador: 'Rodri', seleccion: 'España', equipo: 'Manchester City', categoria: 'COMUN' },
    cantidad: 2,
    enVenta: false,
  },
  {
    id: 103,
    figurita: { id: 8, numero: 8, jugador: 'Jude Bellingham', seleccion: 'Inglaterra', equipo: 'Real Madrid', categoria: 'EPICO' },
    cantidad: 2,
    enVenta: true,
  },
  {
    id: 104,
    figurita: { id: 14, numero: 14, jugador: 'Gavi', seleccion: 'España', equipo: 'FC Barcelona', categoria: 'COMUN' },
    cantidad: 4,
    enVenta: false,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<'collection' | 'faltantes'>('collection');
  const [faltantes, setFaltantes] = React.useState<Figurita[]>([]);
  const [loadingFaltantes, setLoadingFaltantes] = React.useState(false);
  const [errorFaltantes, setErrorFaltantes] = React.useState(false);
  const user: User = MOCK_USER;

  const cargarFaltantes = async () => {
    setLoadingFaltantes(true);
    setErrorFaltantes(false);
    try {
      const data = await listarFaltantes(user.id);
      setFaltantes(data);
    } catch {
      setErrorFaltantes(true);
    } finally {
      setLoadingFaltantes(false);
    }
  };

  React.useEffect(() => {
    cargarFaltantes();
  }, []);

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>&#128100; {user.nombre}</ProfileTitle>
        <ProfileEmail>{user.email}</ProfileEmail>
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
            Faltantes {!loadingFaltantes && `(${faltantes.length})`}
          </TabButton>
        </TabNav>

        {activeTab === 'collection' && (
          <Collection
            usuarioId={user.id}
            mockTodas={MOCK_TODAS}
            mockRepetidas={MOCK_REPETIDAS}
          />
        )}

        {activeTab === 'faltantes' && (
          <>
            {loadingFaltantes && <p>Cargando faltantes...</p>}
            {errorFaltantes && <EmptyMessage>Error al cargar las figuritas faltantes.</EmptyMessage>}
            {!loadingFaltantes && !errorFaltantes && (
              <>
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
                {faltantes.length === 0 && (
                  <EmptyMessage>No tienes figuritas faltantes.</EmptyMessage>
                )}
              </>
            )}
          </>
        )}
      </TabSection>
    </ProfileContainer>
  );
}
