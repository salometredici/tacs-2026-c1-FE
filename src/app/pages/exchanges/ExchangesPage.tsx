import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { Publication } from '../../interfaces/publications/Publication';
import { getExchangesByUserId, getCardsForExchangeByUserId, submitFeedback } from '../../api/ExchangesService';
import { useUserContext } from '../../context/useUserContext';
import { toastError } from '../../utils/toast';
import PublishFiguritaModal from '../../components/exchanges/PublishFiguritaModal';
import {
  PageContainer, PageTitle, ExchangeList, ExchangeCard,
  ExchangeInfo, ExchangeTitle, ExchangeDetail, TypeBadge,
  RateButton, RatedLabel, EmptyMessage,
  SectionHeader, SectionTitle, PublishButton, PublicationCard, PublicationTypeBadge, Divider,
  Overlay, Modal, ModalTitle, StarsRow, StarButton,
  CommentInput, ModalActions, CancelButton, SubmitButton,
} from './ExchangesPage.styles';
import { ParticipationType } from '../../interfaces/publications/publicationTypes';

const EXCHANGE_TYPE_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' };
const PARTICIPATION_TYPE_LABEL: Record<ParticipationType, string> = {
  INTERCAMBIO: 'Intercambio',
  SUBASTA: 'Subasta',
};

export default function ExchangesPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const [publications, setPublications] = useState<Publication[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const [ratingTarget, setRatingTarget] = useState<Exchange | null>(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [pubs, exch] = await Promise.all([
      getCardsForExchangeByUserId(currentUser.id),
      getExchangesByUserId(currentUser.id),
    ]);
    setPublications(pubs);
    setExchanges(exch);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [currentUser.id]);

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
        calificacion: stars,
        publicacionId: ratingTarget.publicationId,
        comentario: comment.trim() || undefined,
      });
      setExchanges(prev =>
        prev.map(e => e.id === ratingTarget.id ? { ...e, rated: true } : e)
      );
      closeRatingModal();
    } catch {
      toastError('Error al enviar la calificación. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Intercambios</PageTitle>

      {loading ? (
        <EmptyMessage>Cargando...</EmptyMessage>
      ) : (
        <>
          <SectionHeader>
            <SectionTitle>Mis Publicaciones activas ({publications.length})</SectionTitle>
            <PublishButton onClick={() => setShowPublishModal(true)}>
              + Publicar Figurita
            </PublishButton>
          </SectionHeader>

          {publications.length === 0 ? (
            <EmptyMessage>No tenés figuritas publicadas para intercambio.</EmptyMessage>
          ) : (
            <ExchangeList>
              {publications.map(pub => (
                <PublicationCard key={pub.id}>
                  <ExchangeInfo>
                    <ExchangeTitle>
                      #{pub.card.number} · {pub.card.description}
                    </ExchangeTitle>
                    <ExchangeDetail>
                      {pub.card.country} · {pub.card.category} · ×{pub.count}
                    </ExchangeDetail>
                  </ExchangeInfo>
                  <PublicationTypeBadge $type={pub.participationType}>
                    {PARTICIPATION_TYPE_LABEL[pub.participationType]}
                  </PublicationTypeBadge>
                </PublicationCard>
              ))}
            </ExchangeList>
          )}

          <Divider />

          <SectionHeader>
            <SectionTitle>Intercambios completados ({exchanges.length})</SectionTitle>
          </SectionHeader>

          {exchanges.length === 0 ? (
            <EmptyMessage>No tenés intercambios concretados todavía.</EmptyMessage>
          ) : (
            <ExchangeList>
              {exchanges.map(e => (
                <ExchangeCard key={e.id}>
                  <ExchangeInfo>
                    <ExchangeTitle>
                      #{e.card.number} · {e.card.description}
                    </ExchangeTitle>
                    <ExchangeDetail>
                      Con {e.otherUser.name} · {new Date(e.date).toLocaleDateString('es-AR')}
                    </ExchangeDetail>
                  </ExchangeInfo>
                  <TypeBadge $type={e.type}>{EXCHANGE_TYPE_LABEL[e.type]}</TypeBadge>
                  {e.rated
                    ? <RatedLabel>✓ Calificado</RatedLabel>
                    : <RateButton onClick={() => openRatingModal(e)}>Calificar</RateButton>
                  }
                </ExchangeCard>
              ))}
            </ExchangeList>
          )}
        </>
      )}

      {showPublishModal && (
        <PublishFiguritaModal
          userId={currentUser.id}
          onClose={() => setShowPublishModal(false)}
          onSuccess={loadData}
        />
      )}

      {ratingTarget && (
        <Overlay onClick={ev => { if (ev.target === ev.currentTarget) closeRatingModal(); }}>
          <Modal>
            <ModalTitle>Calificar a {ratingTarget.otherUser.name}</ModalTitle>
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
