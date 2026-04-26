import React, { useState } from 'react';
import { Category } from '../../interfaces/Categoria';
import { PublishFiguritaRequest } from '../../interfaces/exchanges/PublishFiguritaRequest';
import { publishFigurita } from '../../api/ExchangesService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Row, Field, Input, Select, TypeToggle, TypeOption,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from './PublishFiguritaModal.styles';
import { ParticipationType } from '../../interfaces/publications/publicationTypes';

const CATEGORIES: Category[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

const emptyForm = (): PublishFiguritaRequest => ({
  number: '' as unknown as number,
  player: '',
  country: '',
  team: '',
  description: '',
  category: 'COMUN',
  quantity: 1,
  participationType: 'INTERCAMBIO',
});

interface Props {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PublishFiguritaModal({ userId, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<PublishFiguritaRequest>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof PublishFiguritaRequest, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = (): string | null => {
    if (!form.number || (form.number as unknown as string) === '') return 'El número es obligatorio.';
    if (!form.player.trim()) return 'El jugador es obligatorio.';
    if (!form.country.trim() && !form.team.trim()) return 'Completá al menos selección o equipo.';
    if (!form.quantity || form.quantity < 1) return 'La cantidad debe ser al menos 1.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError(null);
    setSubmitting(true);
    try {
      await publishFigurita(userId, form);
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

        <Row>
          <Field>
            <label htmlFor="pf-numero">Número *</label>
            <Input
              id="pf-numero"
              type="number"
              min={1}
              placeholder="Ej: 10"
              value={form.number || ''}
              onChange={e => set('number', parseInt(e.target.value) || ('' as unknown as number))}
            />
          </Field>
          <Field>
            <label htmlFor="pf-categoria">Categoría *</label>
            <Select
              id="pf-categoria"
              value={form.category}
              onChange={e => set('category', e.target.value as Category)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </Row>

        <Field>
          <label htmlFor="pf-jugador">Jugador *</label>
          <Input
            id="pf-jugador"
            type="text"
            placeholder="Ej: Lionel Messi"
            value={form.player}
            onChange={e => set('player', e.target.value)}
          />
        </Field>

        <Row>
          <Field>
            <label htmlFor="pf-seleccion">Selección</label>
            <Input
              id="pf-seleccion"
              type="text"
              placeholder="Ej: Argentina"
              value={form.country}
              onChange={e => set('country', e.target.value)}
            />
          </Field>
          <Field>
            <label htmlFor="pf-equipo">Equipo</label>
            <Input
              id="pf-equipo"
              type="text"
              placeholder="Ej: Inter Miami"
              value={form.team}
              onChange={e => set('team', e.target.value)}
            />
          </Field>
        </Row>

        <Row>
          <Field>
            <label htmlFor="pf-cantidad">Cantidad disponible *</label>
            <Input
              id="pf-cantidad"
              type="number"
              min={1}
              value={form.quantity}
              onChange={e => set('quantity', parseInt(e.target.value) || 1)}
            />
          </Field>
          <Field>
            <label htmlFor="pf-descripcion">Descripción (opcional)</label>
            <Input
              id="pf-descripcion"
              type="text"
              placeholder="Info adicional"
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
            />
          </Field>
        </Row>

        <Field>
          <label>Tipo de participación *</label>
          <TypeToggle>
            {(['INTERCAMBIO', 'SUBASTA'] as ParticipationType[]).map(type => (
              <TypeOption
                key={type}
                type="button"
                $active={form.participationType === type}
                onClick={() => set('participationType', type)}
              >
                {type === 'INTERCAMBIO' ? '⇄ Intercambio directo' : '🔨 Subasta'}
              </TypeOption>
            ))}
          </TypeToggle>
        </Field>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Publicando...' : 'Publicar'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
