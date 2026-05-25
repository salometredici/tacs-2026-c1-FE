import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { Category } from '../../interfaces/Categoria';
import { getCatalog } from '../../api/CardsService';
import { addMissingCard, getUserCollection, getUserMissingCards } from '../../api/UsersService';
import { useSnackbar } from '../../context/useSnackbar';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Field, Hint, Input, Select, Row,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from '../exchanges/PublishCardModal.styles';
import {
  CardList, FiguritaItem, CardNum, CardDescription, CardQuantityLabel,
  AddButton, RemoveButton, EmptyItem, SectionLabel,
} from '../proposals/MakeProposalModal.styles';

const CATEGORIES: Category[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMissingCardsModal({ userId, onClose, onSuccess }: Props) {
  const { showSuccess } = useSnackbar();
  const [catalog, setCatalog] = useState<Card[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [pending, setPending] = useState<Card[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Excluir del listado las cartas que el user ya tiene en colección y las que ya marcó como faltantes — evita el 409 del BE y elimina ruido de UI
    Promise.allSettled([
      getCatalog(),
      getUserCollection(userId),
      getUserMissingCards(userId),
    ]).then(([cat, col, miss]) => {
      if (cat.status === 'fulfilled') setCatalog(cat.value);
      const ids = new Set<string>();
      if (col.status === 'fulfilled') col.value.forEach(c => ids.add(c.cardId));
      if (miss.status === 'fulfilled') miss.value.forEach(m => ids.add(m.cardId));
      setExcludedIds(ids);
    });
  }, [userId]);

  const pendingIds = new Set(pending.map(f => f.id));

  const filtered = catalog.filter(f => {
    if (pendingIds.has(f.id) || excludedIds.has(f.id)) return false;
    const matchesQuery =
      !query ||
      f.description.toLowerCase().includes(query.toLowerCase()) ||
      String(f.number).includes(query);
    const matchesCategory = !category || f.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleAdd = (f: Card) => setPending(prev => [...prev, f]);
  const handleRemove = (id: string) => setPending(prev => prev.filter(f => f.id !== id));

  const handleConfirm = async () => {
    if (pending.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      for (const f of pending) {
        await addMissingCard(userId, f.id);
      }
      showSuccess(`${pending.length} figurita${pending.length === 1 ? '' : 's'} agregada${pending.length === 1 ? '' : 's'} a faltantes`);
      onSuccess();
      onClose();
    } catch {
      setError('Error al registrar los faltantes. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Agregar figuritas faltantes</ModalTitle>
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
                <FiguritaItem key={f.id}>
                  <CardNum>#{f.number}</CardNum>
                  <CardDescription>{f.description}</CardDescription>
                  <CardQuantityLabel>{f.category}</CardQuantityLabel>
                  <AddButton type="button" onClick={() => handleAdd(f)}>Agregar</AddButton>
                </FiguritaItem>
              ))}
              {filtered.length === 0 && (
                <EmptyItem>Sin resultados</EmptyItem>
              )}
            </CardList>
          )}
        </Field>

        {pending.length > 0 && (
          <Field>
            <SectionLabel>Para registrar ({pending.length})</SectionLabel>
            <CardList>
              {pending.map(f => (
                <FiguritaItem key={f.id}>
                  <CardNum>#{f.number}</CardNum>
                  <CardDescription>{f.description}</CardDescription>
                  <CardQuantityLabel>{f.category}</CardQuantityLabel>
                  <RemoveButton type="button" onClick={() => handleRemove(f.id)}>Quitar</RemoveButton>
                </FiguritaItem>
              ))}
            </CardList>
          </Field>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton type="button" onClick={handleConfirm} disabled={pending.length === 0 || submitting}>
            {submitting ? 'Registrando...' : `Confirmar (${pending.length})`}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
