import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { Category } from '../../interfaces/Category';
import { getCatalog } from '../../api/CardsService';
import { addToUserCollection } from '../../api/UsersService';
import { useSnackbar } from '../../context/useSnackbar';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Field, Hint, Input, Select, Row,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from '../exchanges/PublishCardModal.styles';
import {
  CardList, CardItem, CardNum, CardDescription, CardQuantityLabel,
  AddButton, RemoveButton, EmptyItem, SectionLabel,
  QtyRow, QtyButton, QtyDisplay,
} from '../common/styles/cardList.styles';

const CATEGORIES: Category[] = ['COMUN', 'EPICO', 'LEGENDARIO'];
const MAX_QTY = 100;

interface PendingCard {
  card: Card;
  qty: number;
}

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToCollectionModal({ userId, onClose, onSuccess }: Props) {
  const { showSuccess } = useSnackbar();
  const [catalog, setCatalog] = useState<Card[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [pending, setPending] = useState<PendingCard[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCatalog().then(setCatalog);
  }, []);

  const pendingIds = new Set(pending.map(p => p.card.id));

  // No se excluyen las cartas ya poseídas: agregar una que ya tenés incrementa la cantidad (repetida).
  const filtered = catalog.filter(f => {
    if (pendingIds.has(f.id)) return false;
    const matchesQuery =
      !query ||
      f.id.toLowerCase().includes(query.toLowerCase()) ||
      f.description.toLowerCase().includes(query.toLowerCase()) ||
      String(f.number).includes(query);
    const matchesCategory = !category || f.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleAdd = (f: Card) => setPending(prev => [...prev, { card: f, qty: 1 }]);
  const handleRemove = (id: string) => setPending(prev => prev.filter(p => p.card.id !== id));
  const changeQty = (id: string, delta: number) =>
    setPending(prev => prev.map(p =>
      p.card.id === id ? { ...p, qty: Math.min(MAX_QTY, Math.max(1, p.qty + delta)) } : p
    ));

  const totalCopies = pending.reduce((sum, p) => sum + p.qty, 0);

  const handleConfirm = async () => {
    if (pending.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      // Una sola request por figurita: el BE incrementa la cantidad en p.qty de una.
      for (const p of pending) {
        await addToUserCollection(userId, p.card.id, p.qty);
      }
      showSuccess(`${totalCopies} figurita${totalCopies === 1 ? '' : 's'} agregada${totalCopies === 1 ? '' : 's'} a tu colección`);
      onSuccess();
      onClose();
    } catch {
      setError('Error al agregar las figuritas. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Agregar figuritas a mi colección</ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </CloseButton>
        </ModalHeader>

        <Field>
          <Row>
            <Input
              type="text"
              placeholder="Buscar por id, nombre o número..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <Select
              value={category}
              onChange={e => setCategory(e.target.value as Category | '')}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Row>

          {catalog.length === 0 ? (
            <Hint>Cargando catálogo...</Hint>
          ) : (
            <CardList>
              {filtered.map(f => (
                <CardItem key={f.id}>
                  <CardNum>{f.id}</CardNum>
                  <CardDescription>{f.description}</CardDescription>
                  <CardQuantityLabel>{f.country} · {f.category}</CardQuantityLabel>
                  <AddButton type="button" onClick={() => handleAdd(f)}>Agregar</AddButton>
                </CardItem>
              ))}
              {filtered.length === 0 && (
                <EmptyItem>Sin resultados</EmptyItem>
              )}
            </CardList>
          )}
        </Field>

        {pending.length > 0 && (
          <Field>
            <SectionLabel>Para agregar ({totalCopies})</SectionLabel>
            <CardList>
              {pending.map(p => (
                <CardItem key={p.card.id}>
                  <CardNum>{p.card.id}</CardNum>
                  <CardDescription>{p.card.description}</CardDescription>
                  <QtyRow>
                    <QtyButton
                      type="button"
                      aria-label="Restar una"
                      onClick={() => changeQty(p.card.id, -1)}
                      disabled={p.qty <= 1}
                    >−</QtyButton>
                    <QtyDisplay>{p.qty}</QtyDisplay>
                    <QtyButton
                      type="button"
                      aria-label="Sumar una"
                      onClick={() => changeQty(p.card.id, 1)}
                      disabled={p.qty >= MAX_QTY}
                    >+</QtyButton>
                  </QtyRow>
                  <RemoveButton type="button" onClick={() => handleRemove(p.card.id)}>Quitar</RemoveButton>
                </CardItem>
              ))}
            </CardList>
          </Field>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton type="button" onClick={handleConfirm} disabled={pending.length === 0 || submitting}>
            {submitting ? 'Agregando...' : `Confirmar (${totalCopies})`}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
