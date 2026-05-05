import React from 'react';
import { getUserCollection } from '../../api/UsersService';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import AddToCollectionModal from '../cards/AddToCollectionModal';
import {
  CollectionContainer,
  CardItem,
  CardImage,
  TabButtons,
  TabButton,
  EmptyMessage,
} from './Collection.styles';
import { SectionActionButton } from '../auctions/Auctions.styles';

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
        <SectionActionButton onClick={() => setShowAddModal(true)}>
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Agregar Figurita
        </SectionActionButton>
      </div>

      <CollectionContainer>
        {tab === 'todas' && collection.map((fc) => (
          <CardItem key={fc.cardId}>
            <CardImage $category={fc.category}>
              <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
            </CardImage>
            <h4>#{fc.number}</h4>
            <p><strong>{fc.description}</strong></p>
            <p>{fc.country} - {fc.team}</p>
            <p>{fc.category}</p>
            <p>Cantidad: {fc.quantity}</p>
          </CardItem>
        ))}

        {tab === 'repetidas' && repetidas.map((fc) => (
          <CardItem key={fc.cardId}>
            <CardImage $category={fc.category}>
              <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
            </CardImage>
            <h4>#{fc.number} · x{fc.quantity}</h4>
            <p><strong>{fc.description}</strong></p>
          </CardItem>
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
