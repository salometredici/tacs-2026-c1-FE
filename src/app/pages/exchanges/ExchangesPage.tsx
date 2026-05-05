import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { getExchangesByUserId, submitFeedback } from '../../api/ExchangesService';
import { useUserContext } from '../../context/useUserContext';
import { useSnackbar } from '../../context/useSnackbar';
import { viewAs } from '../../utils/exchangeView';
import {
  PageContainer, PageTitle, ExchangeList, ExchangeCard,
  ExchangeInfo, ExchangeTitle, ExchangeDetail, TypeBadge,
  RateButton, RatedLabel, EmptyMessage,
  Overlay, Modal, ModalTitle, StarsRow, StarButton,
  CommentInput, ModalActions, CancelButton, SubmitButton,
} from './ExchangesPage.styles';

const ORIGIN_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' } as const;

export default function ExchangesPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const { showError } = useSnackbar();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);

  const [ratingTarget, setRatingTarget] = useState<Exchange | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getExchangesByUserId(currentUser.id)
      .then(setExchanges)
      .finally(() => setLoading(false));
  }, [currentUser.id]);

  const openRatingModal = (exchange: Exchange) => {
    setRatingTarget(exchange);
    setStars(0);
    setComment('');
  };

  const closeRatingModal = () => setRatingTarget(null);

  const handleSubmitRating = async () => {
    if (!ratingTarget || stars === 0) return;
    setSubmitting(true);
    try {
      await submitFeedback(ratingTarget.id, {
        score: stars,
        comment: comment.trim() || undefined,
      });
      // Optimistic: marca el slot del current user como dejado.
      const view = viewAs(ratingTarget, currentUser.id);
      const newFeedback = { score: stars, comment: comment.trim() || undefined, createdAt: new Date().toISOString() };
      setExchanges(prev =>
        prev.map(e => e.id !== ratingTarget.id ? e : ({
          ...e,
          feedbackFromA: view.isUserA ? newFeedback : e.feedbackFromA,
          feedbackFromB: view.isUserA ? e.feedbackFromB : newFeedback,
        }))
      );
      closeRatingModal();
    } catch {
      showError('Error al enviar la calificación. Intentá nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Intercambios completados</PageTitle>

      {loading ? (
        <EmptyMessage>Cargando...</EmptyMessage>
      ) : exchanges.length === 0 ? (
        <EmptyMessage>No tenés intercambios concretados todavía.</EmptyMessage>
      ) : (
        <ExchangeList>
          {exchanges.map(e => {
            const v = viewAs(e, currentUser.id);
            const received = v.theirCards;
            const headline = received[0];
            const rated = !!v.myFeedback;
            return (
              <ExchangeCard key={e.id}>
                <ExchangeInfo>
                  <ExchangeTitle>
                    {headline ? `#${headline.number} · ${headline.description}` : 'Intercambio'}
                    {received.length > 1 && ` (+${received.length - 1})`}
                  </ExchangeTitle>
                  <ExchangeDetail>
                    Con {v.other.name} · {new Date(e.createdAt).toLocaleDateString('es-AR')}
                  </ExchangeDetail>
                </ExchangeInfo>
                <TypeBadge $type={e.origin.type}>{ORIGIN_LABEL[e.origin.type]}</TypeBadge>
                {rated
                  ? <RatedLabel>✓ Calificado</RatedLabel>
                  : <RateButton onClick={() => openRatingModal(e)}>Calificar</RateButton>
                }
              </ExchangeCard>
            );
          })}
        </ExchangeList>
      )}

      {ratingTarget && (
        <Overlay onClick={ev => { if (ev.target === ev.currentTarget) closeRatingModal(); }}>
          <Modal>
            <ModalTitle>Calificar a {viewAs(ratingTarget, currentUser.id).other.name}</ModalTitle>
            <StarsRow>
              {[1, 2, 3, 4, 5].map(n => (
                <StarButton
                  key={n}
                  type="button"
                  $active={n <= stars}
                  onClick={() => setStars(n === stars ? n - 1 : n)}
                  title={`${n} estrella${n !== 1 ? 's' : ''}`}
                >
                  ★
                </StarButton>
              ))}
            </StarsRow>
            <CommentInput
              placeholder="Comentario opcional..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <ModalActions>
              <CancelButton onClick={closeRatingModal}>Cancelar</CancelButton>
              <SubmitButton onClick={handleSubmitRating} disabled={stars === 0 || submitting}>
                {submitting ? 'Enviando...' : 'Confirmar'}
              </SubmitButton>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
}
