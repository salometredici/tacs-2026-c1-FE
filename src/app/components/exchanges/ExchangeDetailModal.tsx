import { useNavigate } from 'react-router-dom';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { CardSnapshot } from '../../interfaces/exchanges/CardSnapshot';
import { Feedback } from '../../interfaces/exchanges/Feedback';
import { viewAs } from '../../utils/exchangeView';
import {
  Overlay, Modal, ModalHeader, ModalTitle, ModalSubtitle, CloseButton,
  OriginBadge, TwoColumns, Column, ColumnLabel,
  PartyRow, PartyAvatar,
  CardItem, CardMeta,
  FeedbackBlock, FeedbackHeader, FeedbackStars, FeedbackComment, FeedbackPending,
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

const renderFeedback = (fb: Feedback | null, label: string) => (
  fb
    ? <FeedbackBlock>
        <FeedbackHeader>
          <span>{label}</span>
          <FeedbackStars>{'★'.repeat(fb.score)}{'☆'.repeat(5 - fb.score)}</FeedbackStars>
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
          <CloseButton type="button" onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <OriginBadge type="button" $type={exchange.origin.type} onClick={goToOrigin}>
          <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
          Origen: {ORIGIN_LABEL[exchange.origin.type]}
        </OriginBadge>

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
          {renderFeedback(v.myFeedback, 'Tu calificación')}
          {renderFeedback(v.theirFeedback, `${v.other.name} sobre vos`)}
        </TwoColumns>

        <Footer>
          <FooterButton type="button" onClick={onClose}>Cerrar</FooterButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}
