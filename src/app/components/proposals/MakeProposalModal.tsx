import React, { useEffect, useState } from 'react';
import { Figurita } from '../../interfaces/Figurita';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import { getUserCollection } from '../../api/UsersService';
import { makeProposal } from '../../api/ProposalsService';
import {
  Overlay, Modal, ModalHeader, ModalTitle, CloseButton,
  Footer, CancelButton, SubmitButton, ErrorMsg,
} from '../exchanges/PublishFiguritaModal.styles';

interface Props {
  userId: number;
  figurita: Figurita;
  publicacionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MakeProposalModal({ userId, figurita, publicacionId, onClose, onSuccess }: Props) {
  const [coleccion, setColeccion] = useState<FiguritaColeccion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    getUserCollection(userId).then(col => {
      setColeccion(col);
      setLoading(false);
    });
  }, [userId]);

  const toggleFigurita = (cardNumber: number) => {
    setSeleccionadas(prev => {
      if (cardNumber in prev) {
        const { [cardNumber]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [cardNumber]: 1 };
    });
  };

  const updateQuantity = (cardNumber: number, delta: number) => {
    setSeleccionadas(prev => {
      const currentQty = prev[cardNumber] || 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        const { [cardNumber]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [cardNumber]: newQty };
    });
  };

  const disponibles = coleccion
    .filter(fc => !(fc.figurita.numero in seleccionadas))
    .filter(fc =>
      fc.figurita.jugador.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(fc.figurita.numero).includes(busqueda)
    );

  const ofrecidas = coleccion.filter(fc => fc.figurita.numero in seleccionadas);

  const handleSubmit = async () => {
    if (Object.keys(seleccionadas).length === 0) { setError('Seleccioná al menos una figurita para ofrecer.'); return; }
    setSubmitting(true);
    try {
      await makeProposal(publicacionId, userId, Object.keys(seleccionadas).map(Number));
      onSuccess();
      onClose();
    } catch {
      setError('Error al enviar la propuesta. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <ModalTitle>Proponer intercambio</ModalTitle>
          <CloseButton type="button" onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <p>Querés: <strong>#{figurita.numero} {figurita.jugador}</strong> ({figurita.seleccion})</p>

        {loading ? <p>Cargando tu colección...</p> : coleccion.length === 0 ? (
          <p>No tenés figuritas para ofrecer.</p>
        ) : (
          <>
            <input
              placeholder="Buscar por nombre o número..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', boxSizing: 'border-box' }}
            />

            <p><strong>Disponibles:</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                  <th>ID</th><th>Nombre</th><th>Disponible</th><th></th>
                </tr>
              </thead>
              <tbody>
                {disponibles.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '0.5rem', color: '#888' }}>No hay figuritas disponibles</td></tr>
                ) : disponibles.map(fc => (
                  <tr key={fc.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>#{fc.figurita.numero}</td>
                    <td style={{ padding: '0.5rem' }}>{fc.figurita.jugador}</td>
                    <td style={{ padding: '0.5rem' }}>{fc.cantidad}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => toggleFigurita(fc.figurita.numero)}>Agregar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p><strong>Ofrecidas ({ofrecidas.length}):</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                  <th>ID</th><th>Nombre</th><th>Disponible</th><th>Cantidad</th><th></th>
                </tr>
              </thead>
              <tbody>
                {ofrecidas.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '0.5rem', color: '#888' }}>Ninguna seleccionada aún</td></tr>
                ) : ofrecidas.map(fc => (
                  <tr key={fc.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>#{fc.figurita.numero}</td>
                    <td style={{ padding: '0.5rem' }}>{fc.figurita.jugador}</td>
                    <td style={{ padding: '0.5rem' }}>{fc.cantidad}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => updateQuantity(fc.figurita.numero, -1)}>-</button>
                      {' '}{seleccionadas[fc.figurita.numero]}{' '}
                      <button onClick={() => updateQuantity(fc.figurita.numero, +1)} disabled={seleccionadas[fc.figurita.numero] >= fc.cantidad}>+</button>
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <button onClick={() => toggleFigurita(fc.figurita.numero)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={submitting || Object.keys(seleccionadas).length === 0}>
            {submitting ? 'Enviando...' : 'Confirmar propuesta'}
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
