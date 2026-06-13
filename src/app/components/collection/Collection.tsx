import { useState, useEffect } from 'react';
import { getUserCollection } from '../../api/UsersService';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import AddToCollectionModal from '../cards/AddToCollectionModal';
import {
  CollectionContainer,
  CardItem,
  CardImage,
  TabButtons,
  TabButton,
  CollectionHeader,
} from './Collection.styles';
import { SectionActionButton } from '../auctions/Auctions.styles';
import EmptyState from '../common/EmptyState';

interface CollectionProps {
  userId: string;
}

export default function Collection({ userId: userId }: CollectionProps) {
  const [tab, setTab] = useState<'todas' | 'repetidas'>('todas');
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
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

  if (loading) return <EmptyState>Cargando colección...</EmptyState>;

  // Filtra entries con quantity 0 — pueden quedar residuales en el BE tras un trade
  // (cuando todas las copias se transfirieron). Conceptualmente la figurita ya no está
  // en la colección del usuario
  const owned = collection.filter((fc) => fc.quantity > 0);
  const repetidas = owned.filter((fc) => fc.quantity > 1);

  return (
    <div>
      <CollectionHeader>
        <TabButtons>
          <TabButton active={tab === 'todas'} onClick={() => setTab('todas')}>
            Todas ({owned.length})
          </TabButton>
          <TabButton active={tab === 'repetidas'} onClick={() => setTab('repetidas')}>
            Repetidas ({repetidas.length})
          </TabButton>
        </TabButtons>
        <SectionActionButton onClick={() => setShowAddModal(true)}>
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          Agregar Figurita
        </SectionActionButton>
      </CollectionHeader>

      <CollectionContainer>
        {tab === 'todas' && owned.map((fc) => (
          <CardItem key={fc.cardId}>
            <CardImage $category={fc.category}>
              <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
            </CardImage>
            <h4>{fc.cardId}</h4>
            <p><strong>{fc.description}</strong></p>
            <p>{[fc.country, fc.team].filter(Boolean).join(' · ')}</p>
            <p>{fc.category}</p>
            <p>Cantidad: {fc.quantity}</p>
          </CardItem>
        ))}

        {tab === 'repetidas' && repetidas.map((fc) => (
          <CardItem key={fc.cardId}>
            <CardImage $category={fc.category}>
              <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
            </CardImage>
            <h4>{fc.cardId} · x{fc.quantity}</h4>
            <p><strong>{fc.description}</strong></p>
          </CardItem>
        ))}
      </CollectionContainer>

      {tab === 'todas' && owned.length === 0 && (
        <EmptyState>No tenés figuritas en tu colección.</EmptyState>
      )}
      {tab === 'repetidas' && repetidas.length === 0 && (
        <EmptyState>No tenés figuritas repetidas.</EmptyState>
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
