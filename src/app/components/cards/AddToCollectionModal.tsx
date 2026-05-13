import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { Category } from '../../interfaces/Categoria';
import { getCatalog } from '../../api/CardsService';
import { addToUserCollection } from '../../api/UsersService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Field, Hint, Input, Select, Row, SelectableItem, SelectIndicator,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from '../exchanges/PublishCardModal.styles';
import {
  CardList, CardNum, CardDescription, CardQuantityLabel, EmptyItem,
} from '../proposals/MakeProposalModal.styles';

const CATEGORIES: Category[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToCollectionModal({ userId, onClose, onSuccess }: Props) {
  const [catalog, setCatalog] = useState<Card[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [selected, setSelected] = useState<Card | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCatalog().then(setCatalog);
  }, []);

  const filtered = catalog.filter(f => {
    const matchesQuery =
      !query ||
      f.description.toLowerCase().includes(query.toLowerCase()) ||
      String(f.number).includes(query);
    const matchesCategory = !category || f.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleConfirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await addToUserCollection(userId, selected.id);
      onSuccess();
      onClose();
    } catch {
      setError('Error al agregar la figurita. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Agregar figurita a mi colección</ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </CloseButton>
        </ModalHeader>

        <Field>
          <Row>
            <Input
              type="text"
              placeholder="Buscar por nombre o número..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); }}
              autoFocus
            />
            <Select
              value={category}
              onChange={e => { setCategory(e.target.value as Category | ''); setSelected(null); }}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Row>

          {catalog.length === 0 ? (
            <Hint>Cargando catálogo...</Hint>
          ) : (
            <CardList>
              {filtered.map(f => {
                const isSelected = selected?.id === f.id;
                return (
                  <SelectableItem
                    key={f.id}
                    $selected={isSelected}
                    onClick={() => setSelected(f)}
                  >
                    <SelectIndicator $selected={isSelected}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </SelectIndicator>
                    <CardNum>#{f.number}</CardNum>
                    <CardDescription>{f.description}</CardDescription>
                    <CardQuantityLabel>{f.country} · {f.category}</CardQuantityLabel>
                  </SelectableItem>
                );
              })}
              {filtered.length === 0 && (
                <EmptyItem>Sin resultados</EmptyItem>
              )}
            </CardList>
          )}
        </Field>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton type="button" onClick={handleConfirm} disabled={!selected || submitting}>
            {submitting ? 'Agregando...' : 'Confirmar'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
