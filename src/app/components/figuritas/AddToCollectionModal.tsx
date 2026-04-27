import { useEffect, useState } from 'react';
import { Card } from '../../interfaces/cards/Card';
import { Category } from '../../interfaces/Categoria';
import { getCatalog } from '../../api/FiguritasService';
import { addToUserCollection } from '../../api/UsersService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Input, Select, Row, Footer, CancelButton, ConfirmButton, ErrorMsg,
} from './AddMissingCardsModal.styles';

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
          <CloseButton onClick={onClose} title="Cerrar">✕</CloseButton>
        </ModalHeader>

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

        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
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
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr
                    key={f.id}
                    onClick={() => setSelected(f)}
                    style={{
                      borderBottom: '1px solid #eee',
                      background: selected?.id === f.id ? '#e3f2fd' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '0.5rem' }}>#{f.number}</td>
                    <td style={{ padding: '0.5rem' }}>{f.description}</td>
                    <td style={{ padding: '0.5rem' }}>{f.country}</td>
                    <td style={{ padding: '0.5rem' }}>{f.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
            Seleccionada: <strong>#{selected.number} {selected.description}</strong>
          </p>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm} disabled={!selected || submitting}>
            {submitting ? 'Agregando...' : 'Confirmar'}
          </ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
