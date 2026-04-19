import React, { useState } from 'react';
import { Categoria } from '../../interfaces/Categoria';
import { PublishFiguritaRequest } from '../../interfaces/exchanges/PublishFiguritaRequest';
import { publishFigurita } from '../../api/ExchangesService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Row, Field, Input, Select, TypeToggle, TypeOption,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from './PublishFiguritaModal.styles';
import { TIPO_PARTICIPACION } from '../../interfaces/publicaciones/publicacionTypes';

const CATEGORIAS: Categoria[] = ['COMUN', 'EPICO', 'LEGENDARIO'];

const emptyForm = (): PublishFiguritaRequest => ({
  number: '' as unknown as number,
  jugador: '',
  seleccion: '',
  equipo: '',
  descripcion: '',
  categoria: 'COMUN',
  cantidad: 1,
  tipoParticipacion: 'INTERCAMBIO',
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
    if (!form.jugador.trim()) return 'El jugador es obligatorio.';
    if (!form.seleccion.trim() && !form.equipo.trim()) return 'Completá al menos selección o equipo.';
    if (!form.cantidad || form.cantidad < 1) return 'La cantidad debe ser al menos 1.';
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
              value={form.categoria}
              onChange={e => set('categoria', e.target.value as Categoria)}
            >
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
        </Row>

        <Field>
          <label htmlFor="pf-jugador">Jugador *</label>
          <Input
            id="pf-jugador"
            type="text"
            placeholder="Ej: Lionel Messi"
            value={form.jugador}
            onChange={e => set('jugador', e.target.value)}
          />
        </Field>

        <Row>
          <Field>
            <label htmlFor="pf-seleccion">Selección</label>
            <Input
              id="pf-seleccion"
              type="text"
              placeholder="Ej: Argentina"
              value={form.seleccion}
              onChange={e => set('seleccion', e.target.value)}
            />
          </Field>
          <Field>
            <label htmlFor="pf-equipo">Equipo</label>
            <Input
              id="pf-equipo"
              type="text"
              placeholder="Ej: Inter Miami"
              value={form.equipo}
              onChange={e => set('equipo', e.target.value)}
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
              value={form.cantidad}
              onChange={e => set('cantidad', parseInt(e.target.value) || 1)}
            />
          </Field>
          <Field>
            <label htmlFor="pf-descripcion">Descripción (opcional)</label>
            <Input
              id="pf-descripcion"
              type="text"
              placeholder="Info adicional"
              value={form.descripcion ?? ''}
              onChange={e => set('descripcion', e.target.value)}
            />
          </Field>
        </Row>

        <Field>
          <label>Tipo de participación *</label>
          <TypeToggle>
            {(['INTERCAMBIO', 'SUBASTA'] as TIPO_PARTICIPACION[]).map(tipo => (
              <TypeOption
                key={tipo}
                type="button"
                $active={form.tipoParticipacion === tipo}
                onClick={() => set('tipoParticipacion', tipo)}
              >
                {tipo === 'INTERCAMBIO' ? '⇄ Intercambio directo' : '🔨 Subasta'}
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
