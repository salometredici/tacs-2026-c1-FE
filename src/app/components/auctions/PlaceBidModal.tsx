import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { placeBid } from '../../api/AuctionsService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from '../exchanges/PublishCardModal.styles';
import {
  SearchInput,
  SectionLabel,
  CardList,
  FiguritaItem,
  CardNum,
  CardDescription,
  CardQuantityLabel,
  AddButton,
  RemoveButton,
  QtyRow,
  QtyButton,
  QtyDisplay,
  EmptyItem,
} from '../proposals/MakeProposalModal.styles';

interface Props {
  userId: string;
  figurita: Card;
  auctionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PlaceBidModal({ userId, figurita, auctionId, onClose, onSuccess }: Props) {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserCollection(userId).then(col => {
      setCollection(col);
      setLoading(false);
    });
  }, [userId]);

  const toggleFigurita = (cardNumber: number) => {
    setSelected(prev => {
      if (cardNumber in prev) {
        const { [cardNumber]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardNumber]: 1 };
    });
  };

  const updateQuantity = (cardNumber: number, delta: number) => {
    setSelected(prev => {
      const newQty = (prev[cardNumber] || 0) + delta;
      if (newQty <= 0) {
        const { [cardNumber]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardNumber]: newQty };
    });
  };

  const available = collection
    .filter(fc => !(fc.number in selected))
    .filter(fc =>
      fc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(fc.number).includes(searchQuery)
    );

  const offered = collection.filter(fc => fc.number in selected);

  const handleSubmit = async () => {
    if (Object.keys(selected).length === 0) {
      setError('Seleccioná al menos una figurita para ofrecer.');
      return;
    }
    setSubmitting(true);
    try {
      await placeBid(auctionId, userId, Object.keys(selected));
      onSuccess();
      onClose();
    } catch {
      setError('Error al enviar la propuesta. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Ofertar</ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </CloseButton>
        </ModalHeader>

        <p style={{ margin: 0 }}>
          Querés: <strong>#{figurita.number} {figurita.description}</strong> ({figurita.country})
        </p>

        {loading ? (
          <p style={{ margin: 0 }}>Cargando tu colección...</p>
        ) : collection.length === 0 ? (
          <p style={{ margin: 0 }}>No tenés figuritas para ofertar.</p>
        ) : (
          <>
            <SearchInput
              placeholder="Buscar por descripción o número..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <div>
              <SectionLabel>Disponibles</SectionLabel>
              <CardList>
                {available.length === 0 ? (
                  <EmptyItem>No hay figuritas disponibles</EmptyItem>
                ) : available.map(fc => (
                  <FiguritaItem key={fc.cardId}>
                    <CardNum>#{fc.number}</CardNum>
                    <CardDescription>{fc.description}</CardDescription>
                    <CardQuantityLabel>x{fc.quantity}</CardQuantityLabel>
                    <AddButton onClick={() => toggleFigurita(fc.number)}>Agregar</AddButton>
                  </FiguritaItem>
                ))}
              </CardList>
            </div>

            <div>
              <SectionLabel>Ofrecidas ({offered.length})</SectionLabel>
              <CardList>
                {offered.length === 0 ? (
                  <EmptyItem>Ninguna seleccionada aún</EmptyItem>
                ) : offered.map(fc => (
                  <FiguritaItem key={fc.cardId}>
                    <CardNum>#{fc.number}</CardNum>
                    <CardDescription>{fc.description}</CardDescription>
                    <QtyRow>
                      <QtyButton onClick={() => updateQuantity(fc.number, -1)}>−</QtyButton>
                      <QtyDisplay>{selected[fc.number]}</QtyDisplay>
                      <QtyButton
                        onClick={() => updateQuantity(fc.number, +1)}
                        disabled={selected[fc.number] >= fc.quantity}
                      >+</QtyButton>
                    </QtyRow>
                    <RemoveButton onClick={() => toggleFigurita(fc.number)}>Quitar</RemoveButton>
                  </FiguritaItem>
                ))}
              </CardList>
            </div>
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={submitting || Object.keys(selected).length === 0}>
            {submitting ? 'Enviando...' : 'Confirmar oferta'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
