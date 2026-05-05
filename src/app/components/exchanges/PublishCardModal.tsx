import React, { useEffect, useMemo, useState } from 'react';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { publishFigurita } from '../../api/PublicationsService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Field, Hint, Input, SelectableItem, SelectIndicator,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from './PublishCardModal.styles';
import {
  SearchInput, CardList, CardNum, CardDescription, CardQuantityLabel, EmptyItem,
} from '../proposals/MakeProposalModal.styles';

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const availableOf = (c: CollectionCard) => c.quantity - c.compromisedCount;

export default function PublishFiguritaModal({ userId, onClose, onSuccess }: Props) {
  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserCollection(userId)
      .then(setCollection)
      .catch(() => setCollection([]))
      .finally(() => setLoadingCollection(false));
  }, [userId]);

  const selectedCard = useMemo(
    () => collection.find(c => c.cardId === selectedCardId) ?? null,
    [collection, selectedCardId]
  );
  const maxQuantity = selectedCard ? availableOf(selectedCard) : 0;

  const filtered = collection.filter(c =>
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(c.number).includes(searchQuery)
  );

  const selectCard = (c: CollectionCard) => {
    if (availableOf(c) <= 0) return;
    setSelectedCardId(c.cardId);
    setQuantity(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) { setError('Seleccioná una figurita.'); return; }
    if (quantity < 1 || quantity > maxQuantity) {
      setError(`La cantidad debe estar entre 1 y ${maxQuantity}.`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await publishFigurita(userId, { cardId: selectedCard.cardId, quantity });
      onSuccess();
      onClose();
    } catch {
      setError('Error al publicar la figurita. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Publicar Figurita</ModalTitle>
          <CloseButton type="button" onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <Field>
          <label>Elegí una figurita de tu colección</label>
          {loadingCollection ? (
            <Hint>Cargando colección...</Hint>
          ) : collection.length === 0 ? (
            <Hint>No tenés figuritas en tu colección.</Hint>
          ) : (
            <>
              <SearchInput
                placeholder="Buscar por descripción o número..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <CardList>
                {filtered.map(c => {
                  const available = availableOf(c);
                  const disabled = available <= 0;
                  const isSelected = selectedCardId === c.cardId;
                  return (
                    <SelectableItem
                      key={c.cardId}
                      $selected={isSelected}
                      $disabled={disabled}
                      onClick={() => selectCard(c)}
                      title={disabled ? 'No tenés disponibilidad de esta figurita' : undefined}
                    >
                      <SelectIndicator $selected={isSelected}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </SelectIndicator>
                      <CardNum>#{c.number}</CardNum>
                      <CardDescription>{c.description}</CardDescription>
                      <CardQuantityLabel>
                        {available} disp. / {c.quantity} tot.
                      </CardQuantityLabel>
                    </SelectableItem>
                  );
                })}
                {filtered.length === 0 && (
                  <EmptyItem>No se encontraron figuritas</EmptyItem>
                )}
              </CardList>
            </>
          )}
        </Field>

        {selectedCard && (
          <Field>
            <label htmlFor="pf-cantidad">Cantidad a publicar</label>
            <Hint>Disponibles: {maxQuantity} de {selectedCard.quantity} totales</Hint>
            <Input
              id="pf-cantidad"
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={e => {
                const n = parseInt(e.target.value) || 1;
                setQuantity(Math.min(Math.max(n, 1), maxQuantity));
              }}
              style={{ width: '120px' }}
            />
          </Field>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton type="submit" disabled={submitting || !selectedCard}>
            {submitting ? 'Publicando...' : 'Publicar'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
