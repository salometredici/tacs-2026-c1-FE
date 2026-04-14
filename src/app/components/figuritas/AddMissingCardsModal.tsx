import React, { useState } from 'react';
import { Categoria } from '../../interfaces/Categoria';
import { AddMissingCardRequest } from '../../interfaces/figuritas/AddMissingCardRequest';
import { addMissingCard } from '../../api/FiguritasService';
import { toastError } from '../../utils/toast';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Form, FormTitle, Row, Field, Input, Select, AddToListButton,
  PendingList, PendingListTitle, PendingItem, PendingItemInfo, RemoveButton,
  Footer, CancelButton, ConfirmButton, ErrorMsg,
} from './AddMissingCardsModal.styles';

const CATEGORIAS: Categoria[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

const emptyForm = (): AddMissingCardRequest => ({
  numero: '' as unknown as number,
  jugador: '',
  seleccion: '',
  equipo: '',
  descripcion: '',
  categoria: 'COMUN',
});

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
    try {
      for (const card of pending) {
        await addMissingCard(userId, card);
      }
      onSuccess();
      onClose();
    } catch {
      toastError('Ocurrió un error al registrar las figuritas. Intentá de nuevo.');
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
