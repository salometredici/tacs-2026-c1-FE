import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { PROPOSAL_STATUS_LABEL as STATUS_LABEL, PROPOSAL_STATUS_TONE as STATUS_TONE } from '../../interfaces/proposals/ProposalStatus';
import {
  Overlay, Modal, ModalHeader, ModalTitle, ModalSubtitle, CloseButton,
  OriginBadge, HeaderActions, TwoColumns, Column, ColumnLabel,
  CardItem, CardMeta,
  Footer, FooterButton,
} from '../exchanges/ExchangeDetailModal.styles';
import StatusBadge from '../common/StatusBadge';
import { AcceptButton, RejectButton } from '../../pages/proposals/ProposalsPage.styles';

interface Props {
  proposal: Proposal;
  onClose: () => void;
  // Si vienen y la propuesta está PENDIENTE, se muestran botones Aceptar/Rechazar en el footer
  // El caller maneja el error/success — el modal solo dispara las callbacks y cierra
  onAccept?: () => Promise<void> | void;
  onReject?: () => Promise<void> | void;
  // Si viene y la propuesta está PENDIENTE, se muestra "Cancelar propuesta" (para el proponente)
  onCancel?: () => Promise<void> | void;
}

const formatDateTime = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function ProposalDetailModal({ proposal, onClose, onAccept, onReject, onCancel }: Props) {
  const navigate = useNavigate();
  const pubCard = proposal.publication.card;
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | 'cancel' | null>(null);
  const showActions = proposal.status === 'PENDIENTE' && (onAccept || onReject);
  const showCancel = proposal.status === 'PENDIENTE' && !!onCancel;

  const goToPublication = () => {
    onClose();
    navigate(`/publications/${proposal.publication.id}`);
  };

  const handleAccept = async () => {
    if (!onAccept) return;
    setActionLoading('accept');
    try { await onAccept(); } finally { setActionLoading(null); onClose(); }
  };

  const handleReject = async () => {
    if (!onReject) return;
    setActionLoading('reject');
    try { await onReject(); } finally { setActionLoading(null); onClose(); }
  };

  const handleCancel = async () => {
    if (!onCancel) return;
    setActionLoading('cancel');
    try { await onCancel(); } finally { setActionLoading(null); onClose(); }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <div>
            <ModalTitle>Propuesta #{proposal.id.slice(-6)}</ModalTitle>
            <ModalSubtitle>{formatDateTime(proposal.creationDate)}</ModalSubtitle>
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </CloseButton>
        </ModalHeader>

        <HeaderActions>
          <OriginBadge type="button" $type="PROPUESTA" onClick={goToPublication}>
            <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
            Ver publicación
          </OriginBadge>
          <StatusBadge tone={STATUS_TONE[proposal.status]}>{STATUS_LABEL[proposal.status]}</StatusBadge>
        </HeaderActions>

        <TwoColumns>
          <Column>
            <ColumnLabel>Pidió</ColumnLabel>
            <CardItem>
              <span>{proposal.requestedCount} × <strong>{pubCard.id}</strong> · {pubCard.description}</span>
              <CardMeta>
                {[pubCard.country, pubCard.team, pubCard.category].filter(Boolean).join(' · ')}
              </CardMeta>
            </CardItem>
          </Column>
          <Column>
            <ColumnLabel>A cambio de ({proposal.offeredCards.length})</ColumnLabel>
            {proposal.offeredCards.length === 0
              ? <CardMeta>Sin figuritas</CardMeta>
              : proposal.offeredCards.map((c, i) => (
                  <CardItem key={`${c.id}-${i}`}>
                    <span>1 × <strong>{c.id || '?'}</strong> · {c.description || '(sin detalle)'}</span>
                    {(c.country || c.team || c.category) && (
                      <CardMeta>
                        {[c.country, c.team, c.category].filter(Boolean).join(' · ')}
                      </CardMeta>
                    )}
                  </CardItem>
                ))
            }
          </Column>
        </TwoColumns>

        <Footer>
          {showCancel && (
            <RejectButton type="button" onClick={handleCancel} disabled={actionLoading !== null}>
              {actionLoading === 'cancel' ? 'Cancelando...' : 'Cancelar propuesta'}
            </RejectButton>
          )}
          {showActions && onReject && (
            <RejectButton type="button" onClick={handleReject} disabled={actionLoading !== null}>
              {actionLoading === 'reject' ? 'Rechazando...' : 'Rechazar'}
            </RejectButton>
          )}
          {showActions && onAccept && (
            <AcceptButton type="button" onClick={handleAccept} disabled={actionLoading !== null}>
              {actionLoading === 'accept' ? 'Aceptando...' : 'Aceptar'}
            </AcceptButton>
          )}
          <FooterButton type="button" onClick={onClose} disabled={actionLoading !== null}>Cerrar</FooterButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
