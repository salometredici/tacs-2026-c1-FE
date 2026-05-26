import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { CardSnapshot } from '../../interfaces/exchanges/CardSnapshot';
import { Feedback } from '../../interfaces/exchanges/Feedback';
import { viewAs } from '../../utils/exchangeView';
import { submitFeedback } from '../../api/ExchangesService';
import { useSnackbar } from '../../context/useSnackbar';
import {
  Overlay, Modal, ModalHeader, ModalTitle, ModalSubtitle, CloseButton,
  OriginBadge, HeaderActions, TwoColumns, Column, ColumnLabel,
  PartyRow, PartyAvatar,
  CardItem, CardMeta,
  FeedbackBlock, FeedbackHeader, FeedbackStars, FeedbackComment, FeedbackPending,
  InteractiveStar, FeedbackTextarea, FeedbackFormActions, SecondaryButton,
  Footer, FooterButton,
} from './ExchangeDetailModal.styles';

const ORIGIN_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' } as const;

interface Props {
  exchange: Exchange;
  currentUserId: string;
  onClose: () => void;
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const renderCards = (cards: CardSnapshot[]) => (
  cards.length === 0
    ? <CardMeta>Sin figuritas</CardMeta>
    : cards.map((c, i) => (
        <CardItem key={`${c.cardId}-${i}`}>
          <span><strong>#{c.number}</strong> · {c.description}</span>
          <CardMeta>
            {[c.country, c.team, c.category].filter(Boolean).join(' · ')}
          </CardMeta>
        </CardItem>
      ))
);

const renderStars = (score: number) => (
  <FeedbackStars aria-label={`${score} de 5 estrellas`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="material-symbols-outlined" aria-hidden="true">
        {i < score ? 'star' : 'star_border'}
      </span>
    ))}
  </FeedbackStars>
);

const renderFeedback = (fb: Feedback | null, label: string) => (
  fb
    ? <FeedbackBlock>
        <FeedbackHeader>
          <span>{label}</span>
          {renderStars(fb.score)}
        </FeedbackHeader>
        {fb.comment && <FeedbackComment>"{fb.comment}"</FeedbackComment>}
      </FeedbackBlock>
    : <FeedbackBlock>
        <FeedbackHeader><span>{label}</span></FeedbackHeader>
        <FeedbackPending>Sin calificar todavía</FeedbackPending>
      </FeedbackBlock>
);

export default function ExchangeDetailModal({ exchange, currentUserId, onClose }: Props) {
  const navigate = useNavigate();
  const v = viewAs(exchange, currentUserId);
  const { showSuccess, showError } = useSnackbar();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedScore, setSelectedScore] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (selectedScore === 0 || submitting) return;
    setSubmitting(true);
    try {
      await submitFeedback(exchange.id, { score: selectedScore, comment: comment.trim() || undefined });
      showSuccess('¡Calificación enviada!');
      onClose();
    } catch {
      showError('Error al enviar la calificación. Intentá nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMyFeedbackSlot = () => {
    if (v.myFeedback) return renderFeedback(v.myFeedback, 'Tu calificación');
    if (showFeedbackForm) {
      return (
        <FeedbackBlock>
          <FeedbackHeader><span>Calificá a {v.other.name}</span></FeedbackHeader>
          <FeedbackStars aria-label={`${selectedScore} de 5 estrellas seleccionadas`}>
            {Array.from({ length: 5 }, (_, i) => (
              <InteractiveStar
                key={i}
                className="material-symbols-outlined"
                onClick={() => setSelectedScore(i + 1)}
                aria-hidden="true"
              >
                {i < selectedScore ? 'star' : 'star_border'}
              </InteractiveStar>
            ))}
          </FeedbackStars>
          <FeedbackTextarea
            placeholder="Comentario (opcional)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={2}
            maxLength={500}
          />
          <FeedbackFormActions>
            <SecondaryButton type="button" onClick={() => setShowFeedbackForm(false)} disabled={submitting}>
              Cancelar
            </SecondaryButton>
            <FooterButton type="button" onClick={handleSubmitFeedback} disabled={selectedScore === 0 || submitting}>
              {submitting ? 'Enviando…' : 'Enviar calificación'}
            </FooterButton>
          </FeedbackFormActions>
        </FeedbackBlock>
      );
    }
    return (
      <FeedbackBlock>
        <FeedbackHeader><span>Tu calificación</span></FeedbackHeader>
        <FeedbackFormActions>
          <FooterButton type="button" onClick={() => setShowFeedbackForm(true)}>
            Calificar a {v.other.name}
          </FooterButton>
        </FeedbackFormActions>
      </FeedbackBlock>
    );
  };

  const goToOrigin = () => {
    if (exchange.origin.type === 'PROPUESTA') {
      // La proposal vive sobre una publicación; linkeamos al detalle de la publi.
      // (Si el BE expusiera el publicationId del proposal, podríamos resolverlo
      // directo; por ahora navegamos a /proposals.)
      navigate('/proposals');
    } else {
      navigate(`/auctions/${exchange.origin.id}`);
    }
  };

  return (
    <Overlay onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <ModalHeader>
          <div>
            <ModalTitle>Intercambio con {v.other.name}</ModalTitle>
            <ModalSubtitle>{formatDateTime(exchange.createdAt)}</ModalSubtitle>
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </CloseButton>
        </ModalHeader>

        <HeaderActions>
          <OriginBadge type="button" $type={exchange.origin.type} onClick={goToOrigin}>
            <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
            Origen: {ORIGIN_LABEL[exchange.origin.type]}
          </OriginBadge>
        </HeaderActions>

        <TwoColumns>
          <Column>
            <ColumnLabel>Vos cediste</ColumnLabel>
            <PartyRow>
              <PartyAvatar src="/assets/user-svgrepo-com.svg" alt={v.me.name} />
              <strong>{v.me.name}</strong>
            </PartyRow>
            {renderCards(v.myCards)}
          </Column>
          <Column>
            <ColumnLabel>Recibiste</ColumnLabel>
            <PartyRow>
              <PartyAvatar src="/assets/user-svgrepo-com.svg" alt={v.other.name} />
              <strong>{v.other.name}</strong>
            </PartyRow>
            {renderCards(v.theirCards)}
          </Column>
        </TwoColumns>

        <TwoColumns>
          {renderMyFeedbackSlot()}
          {renderFeedback(v.theirFeedback, `${v.other.name} sobre vos`)}
        </TwoColumns>

        <Footer>
          <FooterButton type="button" onClick={onClose}>Cerrar</FooterButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
