import React, { useState } from 'react';
import styled from 'styled-components';
import { Categoria } from '../../interfaces/Categoria';
import { AddMissingCardRequest } from '../../interfaces/figuritas/AddMissingCardRequest';
import { addMissingCard } from '../../api/FiguritasService';
import { theme } from '../../styles/theme';

// ─── Estilos ────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const Modal = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  color: ${theme.colors.primary};
  margin: 0;
  font-size: 1.3rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  line-height: 1;
  &:hover { color: ${theme.colors.text}; }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background};
`;

const FormTitle = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${theme.colors.text};
  }
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const AddToListButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 2px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  transition: all 0.2s;
  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const PendingListTitle = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.text};
  margin: 0;
`;

const PendingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: 0.9rem;
`;

const PendingItemInfo = styled.span`
  color: ${theme.colors.text};
  span { color: ${theme.colors.textSecondary}; }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.danger};
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  &:hover { opacity: 0.7; }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

const CancelButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
  cursor: pointer;
  &:hover { border-color: ${theme.colors.text}; color: ${theme.colors.text}; }
`;

const ConfirmButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #1565c0; }
  &:disabled { background: ${theme.colors.border}; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.85rem;
  margin: 0;
`;

// ─── Tipos ───────────────────────────────────────────────────────────────────

const CATEGORIAS: Categoria[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

const emptyForm = (): AddMissingCardRequest => ({
  numero: '' as unknown as number,
  jugador: '',
  seleccion: '',
  equipo: '',
  descripcion: '',
  categoria: 'COMUN',
});

// ─── Componente ─────────────────────────────────────────────────────────────

interface Props {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMissingCardsModal({ userId, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<AddMissingCardRequest>(emptyForm());
  const [pending, setPending] = useState<AddMissingCardRequest[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof AddMissingCardRequest, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleAddToList = () => {
    if (!form.numero || form.numero <= 0) {
      setFormError('El número de figurita es obligatorio.');
      return;
    }
    if (!form.jugador.trim()) {
      setFormError('El nombre del jugador es obligatorio.');
      return;
    }
    if (!form.seleccion.trim() && !form.equipo.trim()) {
      setFormError('Completá al menos selección o equipo.');
      return;
    }
    setPending(prev => [...prev, { ...form }]);
    setForm(emptyForm());
    setFormError(null);
  };

  const handleRemove = (index: number) => {
    setPending(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (pending.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      for (const card of pending) {
        await addMissingCard(userId, card);
      }
      onSuccess();
      onClose();
    } catch {
      setSubmitError('Ocurrió un error al registrar las figuritas. Intentá de nuevo.');
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

        {/* ── Formulario de una figurita ── */}
        <Form>
          <FormTitle>Completá los datos de la figurita</FormTitle>

          <Row>
            <Field>
              <label htmlFor="fm-numero">Número *</label>
              <Input
                id="fm-numero"
                type="number"
                min={1}
                placeholder="Ej: 42"
                value={form.numero || ''}
                onChange={e => handleChange('numero', parseInt(e.target.value) || ('' as unknown as number))}
              />
            </Field>
            <Field>
              <label htmlFor="fm-categoria">Categoría *</label>
              <Select
                id="fm-categoria"
                value={form.categoria}
                onChange={e => handleChange('categoria', e.target.value as Categoria)}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </Row>

          <Field>
            <label htmlFor="fm-jugador">Jugador *</label>
            <Input
              id="fm-jugador"
              type="text"
              placeholder="Ej: Lionel Messi"
              value={form.jugador}
              onChange={e => handleChange('jugador', e.target.value)}
            />
          </Field>

          <Row>
            <Field>
              <label htmlFor="fm-seleccion">Selección</label>
              <Input
                id="fm-seleccion"
                type="text"
                placeholder="Ej: Argentina"
                value={form.seleccion}
                onChange={e => handleChange('seleccion', e.target.value)}
              />
            </Field>
            <Field>
              <label htmlFor="fm-equipo">Equipo</label>
              <Input
                id="fm-equipo"
                type="text"
                placeholder="Ej: Inter Miami"
                value={form.equipo}
                onChange={e => handleChange('equipo', e.target.value)}
              />
            </Field>
          </Row>

          <Field>
            <label htmlFor="fm-descripcion">Descripción (opcional)</label>
            <Input
              id="fm-descripcion"
              type="text"
              placeholder="Descripción adicional"
              value={form.descripcion ?? ''}
              onChange={e => handleChange('descripcion', e.target.value)}
            />
          </Field>

          {formError && <ErrorMsg>{formError}</ErrorMsg>}

          <AddToListButton type="button" onClick={handleAddToList}>
            + Agregar a la lista
          </AddToListButton>
        </Form>

        {/* ── Lista pendiente ── */}
        {pending.length > 0 && (
          <PendingList>
            <PendingListTitle>Para registrar ({pending.length}):</PendingListTitle>
            {pending.map((card, i) => (
              <PendingItem key={i}>
                <PendingItemInfo>
                  <strong>#{card.numero}</strong> · {card.jugador}
                  {card.seleccion && <span> · {card.seleccion}</span>}
                  {card.equipo && <span> · {card.equipo}</span>}
                  <span> · {card.categoria}</span>
                </PendingItemInfo>
                <RemoveButton onClick={() => handleRemove(i)} title="Quitar">✕</RemoveButton>
              </PendingItem>
            ))}
          </PendingList>
        )}

        {submitError && <ErrorMsg>{submitError}</ErrorMsg>}

        {/* ── Acciones ── */}
        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton
            onClick={handleConfirm}
            disabled={pending.length === 0 || submitting}
          >
            {submitting ? 'Registrando...' : `Confirmar (${pending.length})`}
          </ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
