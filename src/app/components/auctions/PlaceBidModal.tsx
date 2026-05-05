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

const availableOf = (c: CollectionCard) => c.quantity - c.compromisedCount;

export default function PlaceBidModal({ userId, figurita, auctionId, onClose, onSuccess }: Props) {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
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

  const toggleFigurita = (cardId: string) => {
    setSelected(prev => {
      if (cardId in prev) {
        const { [cardId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardId]: 1 };
    });
  };

  const updateQuantity = (cardId: string, delta: number) => {
    setSelected(prev => {
      const newQty = (prev[cardId] || 0) + delta;
      if (newQty <= 0) {
        const { [cardId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardId]: newQty };
    });
  };

  const available = collection
    .filter(fc => availableOf(fc) > 0)
    .filter(fc => !(fc.cardId in selected))
    .filter(fc =>
      fc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(fc.number).includes(searchQuery)
    );

  const offered = collection.filter(fc => fc.cardId in selected);
  const totalOffered = Object.values(selected).reduce((acc, qty) => acc + qty, 0);

  const handleSubmit = async () => {
    if (totalOffered === 0) {
      setError('Seleccioná al menos una figurita para ofrecer.');
      return;
    }
    setSubmitting(true);
    try {
      // Expandimos por qty (se agrupa en el service al armar items).
      const cardIds = Object.entries(selected).flatMap(([id, qty]) => Array(qty).fill(id));
      await placeBid(auctionId, userId, cardIds);
      onSuccess();
      onClose();
    } catch (err: any) {
      const beMsg = err?.response?.data?.message ?? err?.response?.data?.error;
      setError(beMsg ?? 'Error al enviar la oferta. Intentá de nuevo.');
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
          Querés: <strong>#{figurita.number} {figurita.description}</strong>
          {figurita.country && ` (${figurita.country})`}
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
                    <CardQuantityLabel>{availableOf(fc)} disp. / {fc.quantity} tot.</CardQuantityLabel>
                    <AddButton onClick={() => toggleFigurita(fc.cardId)}>Agregar</AddButton>
                  </FiguritaItem>
                ))}
              </CardList>
            </div>

            <div>
              <SectionLabel>
                Ofrecidas — {totalOffered} figurita{totalOffered !== 1 ? 's' : ''}
                {totalOffered !== offered.length && ` (${offered.length} únicas)`}
              </SectionLabel>
              <CardList>
                {offered.length === 0 ? (
                  <EmptyItem>Ninguna seleccionada aún</EmptyItem>
                ) : offered.map(fc => (
                  <FiguritaItem key={fc.cardId}>
                    <CardNum>#{fc.number}</CardNum>
                    <CardDescription>{fc.description}</CardDescription>
                    <QtyRow>
                      <QtyButton onClick={() => updateQuantity(fc.cardId, -1)}>−</QtyButton>
                      <QtyDisplay>{selected[fc.cardId]}</QtyDisplay>
                      <QtyButton
                        onClick={() => updateQuantity(fc.cardId, +1)}
                        disabled={selected[fc.cardId] >= availableOf(fc)}
                      >+</QtyButton>
                    </QtyRow>
                    <RemoveButton onClick={() => toggleFigurita(fc.cardId)}>Quitar</RemoveButton>
                  </FiguritaItem>
                ))}
              </CardList>
            </div>
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={submitting || totalOffered === 0}>
            {submitting
              ? 'Enviando...'
              : totalOffered > 0
                ? `Confirmar oferta (${totalOffered} figurita${totalOffered !== 1 ? 's' : ''})`
                : 'Confirmar oferta'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
