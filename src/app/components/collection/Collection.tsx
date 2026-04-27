import React from 'react';
import { getUserCollection } from '../../api/UsersService';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import AddToCollectionModal from '../figuritas/AddToCollectionModal';
import {
  CollectionContainer,
  FiguritaCard,
  TabButtons,
  TabButton,
  EmptyMessage,
} from './Collection.styles';

interface CollectionProps {
  userId: string;
}

export default function Collection({ userId: userId }: CollectionProps) {
  const [tab, setTab] = React.useState<'todas' | 'repetidas'>('todas');
  const [collection, setCollection] = React.useState<CollectionCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);

  React.useEffect(() => {
    loadCollection();
  }, [userId]);

  const loadCollection = async () => {
    try {
      const data = await getUserCollection(userId);
      setCollection(data);
    } catch (error) {
      console.error('Error al cargar la colección de figuritas: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando colección...</p>;

  const repetidas = collection.filter((fc) => fc.quantity > 1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <TabButtons style={{ marginBottom: 0 }}>
          <TabButton active={tab === 'todas'} onClick={() => setTab('todas')}>
            Todas ({collection.length})
          </TabButton>
          <TabButton active={tab === 'repetidas'} onClick={() => setTab('repetidas')}>
            Repetidas ({repetidas.length})
          </TabButton>
        </TabButtons>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          + Agregar figurita
        </button>
      </div>

      <CollectionContainer>
        {tab === 'todas' && collection.map((fc) => (
          <FiguritaCard key={fc.cardId}>
            <h4>#{fc.number}</h4>
            <p><strong>{fc.description}</strong></p>
            <p>{fc.country} - {fc.team}</p>
            <p>{fc.category}</p>
            <p>Cantidad: {fc.quantity}</p>
          </FiguritaCard>
        ))}

        {tab === 'repetidas' && repetidas.map((fc) => (
          <FiguritaCard key={fc.cardId}>
            <h4>#{fc.number} · x{fc.quantity}</h4>
            <p><strong>{fc.description}</strong></p>
          </FiguritaCard>
        ))}
      </CollectionContainer>

      {tab === 'todas' && collection.length === 0 && (
        <EmptyMessage>No tenés figuritas en tu colección</EmptyMessage>
      )}
      {tab === 'repetidas' && repetidas.length === 0 && (
        <EmptyMessage>No tenés figuritas repetidas</EmptyMessage>
      )}

      {showAddModal && (
        <AddToCollectionModal
          userId={userId}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadCollection}
        />
      )}
    </div>
  );
}
