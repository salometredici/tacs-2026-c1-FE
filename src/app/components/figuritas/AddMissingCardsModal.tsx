import { useEffect, useState } from 'react';
import { Figurita } from '../../interfaces/figuritas/Figurita';
import { Category } from '../../interfaces/Categoria';
import { getCatalog } from '../../api/FiguritasService';
import { addMissingCard } from '../../api/UsersService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Input, Select, Row,
  PendingList, PendingListTitle, PendingItem, PendingItemInfo, RemoveButton,
  Footer, CancelButton, ConfirmButton, ErrorMsg,
} from './AddMissingCardsModal.styles';

const CATEGORIES: Category[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMissingCardsModal({ userId, onClose, onSuccess }: Props) {
  const [catalog, setCatalog] = useState<Figurita[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [pending, setPending] = useState<Figurita[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCatalog().then(setCatalog);
  }, []);

  const pendingIds = new Set(pending.map(f => f.id));

  const filtered = catalog.filter(f => {
    if (pendingIds.has(f.id)) return false;
    const matchesQuery =
      !query ||
      f.description.toLowerCase().includes(query.toLowerCase()) ||
      String(f.number).includes(query);
    const matchesCategory = !category || f.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleAdd = (f: Figurita) => setPending(prev => [...prev, f]);
  const handleRemove = (id: string) => setPending(prev => prev.filter(f => f.id !== id));

  const handleConfirm = async () => {
    if (pending.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      for (const f of pending) {
        await addMissingCard(userId, f.id);
      }
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
          <ModalTitle>Agregar Figuritas Faltantes</ModalTitle>
          <CloseButton onClick={onClose} title="Cerrar">✕</CloseButton>
        </ModalHeader>

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

        <div style={{ maxHeight: '260px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          {catalog.length === 0 ? (
            <p style={{ padding: '1rem', color: '#888', margin: 0 }}>Cargando catálogo...</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '1rem', color: '#888', margin: 0 }}>Sin resultados.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left', background: '#f5f5f5', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '0.5rem' }}>#</th>
                  <th style={{ padding: '0.5rem' }}>Nombre</th>
                  <th style={{ padding: '0.5rem' }}>País</th>
                  <th style={{ padding: '0.5rem' }}>Cat.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>#{f.number}</td>
                    <td style={{ padding: '0.5rem' }}>{f.description}</td>
                    <td style={{ padding: '0.5rem' }}>{f.country}</td>
                    <td style={{ padding: '0.5rem' }}>{f.category}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => handleAdd(f)} style={{ cursor: 'pointer' }}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pending.length > 0 && (
          <PendingList>
            <PendingListTitle>Para registrar ({pending.length}):</PendingListTitle>
            {pending.map(f => (
              <PendingItem key={f.id}>
                <PendingItemInfo>
                  <strong>#{f.number}</strong> · {f.description}
                  <span> · {f.category}</span>
                </PendingItemInfo>
                <RemoveButton onClick={() => handleRemove(f.id)} title="Quitar">✕</RemoveButton>
              </PendingItem>
            ))}
          </PendingList>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm} disabled={pending.length === 0 || submitting}>
            {submitting ? 'Registrando...' : `Confirmar (${pending.length})`}
          </ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
