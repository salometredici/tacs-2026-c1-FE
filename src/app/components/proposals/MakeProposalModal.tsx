import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { makeProposal } from '../../api/ProposalsService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Footer, CancelButton, SubmitButton, ErrorMsg,
  Field, Hint, Input,
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
} from './MakeProposalModal.styles';

interface Props {
  userId: string;
  card: Card;
  publicationId: string;
  maxRequestable: number;
  onClose: () => void;
  onSuccess: () => void;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const availableOf = (c: CollectionCard) => c.quantity - c.compromisedCount;

export default function MakeProposalModal({ userId, card, publicationId, maxRequestable, onClose, onSuccess }: Props) {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [requestedCount, setRequestedCount] = useState(1);
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
    if (totalOffered === 0) { setError('Seleccioná al menos una figurita para ofrecer.'); return; }
    if (requestedCount < 1 || requestedCount > maxRequestable) {
      setError(`Pedí entre 1 y ${maxRequestable} figurita${maxRequestable !== 1 ? 's' : ''}.`);
      return;
    }
    setSubmitting(true);
    try {
      // Expandimos por cantidad: si selected[<id>] = 3, mandamos [<id>, <id>, <id>].
      // Así offeredCards.length en el Proposal refleja el total real.
      const cardIds = Object.entries(selected).flatMap(
        ([id, qty]) => Array(qty).fill(id)
      );
      await makeProposal(publicationId, userId, cardIds, requestedCount);
      onSuccess();
      onClose();
    } catch (err: any) {
      const beMsg = err?.response?.data?.message ?? err?.response?.data?.error;
      setError(beMsg ?? 'Error al enviar la propuesta. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Proponer intercambio</ModalTitle>
          <CloseButton type="button" onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <p style={{ margin: 0 }}>
          Querés: <strong>#{card.number} {card.description}</strong>
          {card.country && ` (${card.country})`}
        </p>

        <Field>
          <label htmlFor="mp-requested">¿Cuántas pedís?</label>
          <Hint>Disponibles en la publicación: {maxRequestable}</Hint>
          <Input
            id="mp-requested"
            type="number"
            min={1}
            max={maxRequestable}
            value={requestedCount}
            onChange={e => {
              const n = parseInt(e.target.value) || 1;
              setRequestedCount(clamp(n, 1, maxRequestable));
            }}
            style={{ width: '120px' }}
          />
        </Field>

        {loading ? (
          <p style={{ margin: 0 }}>Cargando tu colección...</p>
        ) : collection.length === 0 ? (
          <p style={{ margin: 0 }}>No tenés figuritas para ofrecer.</p>
        ) : (
          <>
            <SearchInput
              placeholder="Buscar por nombre o número..."
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
                ? `Confirmar — ofrecer ${totalOffered} por ${requestedCount}`
                : 'Confirmar propuesta'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
