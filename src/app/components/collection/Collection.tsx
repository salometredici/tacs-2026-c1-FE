import React from 'react';
import { getUserCollection } from '../../api/UsersService';
import { Figurita } from '../../interfaces/Figurita';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import {
  CollectionContainer,
  FiguritaCard,
  TabButtons,
  TabButton,
  EmptyMessage,
} from './Collection.styles';

interface CollectionProps {
  usuarioId: string;
  mockTodas?: Figurita[];
  mockRepetidas?: FiguritaColeccion[];
}

export default function Collection({ usuarioId, mockTodas, mockRepetidas }: CollectionProps) {
  const [tab, setTab] = React.useState<'todas' | 'repetidas'>('todas');
  const [todas, setTodas] = React.useState<Figurita[]>(mockTodas ?? []);
  const [repetidas, setRepetidas] = React.useState<FiguritaColeccion[]>(mockRepetidas ?? []);
  const [loading, setLoading] = React.useState(!mockTodas && !mockRepetidas);

  React.useEffect(() => {
    if (!mockTodas && !mockRepetidas) {
      cargarColeccion();
    }
  }, [usuarioId]);

  const cargarColeccion = async () => {
    try {
      const coleccion = await getUserCollection(usuarioId);
      setTodas(coleccion.map((fc) => fc.figurita));
      setRepetidas(coleccion.filter((fc) => fc.cantidad > 1));
    } catch (error) {
      console.error('Error al cargar colección:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando colección...</p>;

  return (
    <div>
      <TabButtons>
        <TabButton
          active={tab === 'todas'}
          onClick={() => setTab('todas')}
        >
          Todas ({todas.length})
        </TabButton>
        <TabButton
          active={tab === 'repetidas'}
          onClick={() => setTab('repetidas')}
        >
          Repetidas ({repetidas.length})
        </TabButton>
      </TabButtons>

      <CollectionContainer>
        {tab === 'todas' && todas.map((figurita) => (
          <FiguritaCard key={figurita.id}>
            <h4>#{figurita.number}</h4>
            <p><strong>{figurita.description}</strong></p>
            <p>{figurita.country} - {figurita.team}</p>
            <p>{figurita.category}</p>
          </FiguritaCard>
        ))}

        {tab === 'repetidas' && repetidas.map((fc) => (
          <FiguritaCard key={fc.id}>
            <h4>#{fc.figurita.number}</h4>
            <p><strong>{fc.figurita.description}</strong></p>
            <p>{fc.figurita.country} - {fc.figurita.team}</p>
            <p>Cantidad: {fc.cantidad}{fc.enVenta ? ' (En venta)' : ''}</p>
          </FiguritaCard>
        ))}
      </CollectionContainer>

      {tab === 'todas' && todas.length === 0 && (
        <EmptyMessage>No tienes figuritas en tu colección</EmptyMessage>
      )}
      {tab === 'repetidas' && repetidas.length === 0 && (
        <EmptyMessage>No tienes figuritas repetidas</EmptyMessage>
      )}
    </div>
  );
}
