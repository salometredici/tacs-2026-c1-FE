import { Publication } from '../../../interfaces/publications/Publication';
import StatusBadge from '../../../components/common/StatusBadge';
import { PUBLICATION_STATUS_LABEL as PUB_STATUS_LABEL, PUBLICATION_STATUS_TONE as PUB_TONE } from '../../../interfaces/publications/publicationTypes';
import {
  PublicationCard, TopRow, CardInfo, CardTitle, CardMeta,
  CountSection, CountLabel, CountValue, ProgressTrack, ProgressFill,
  PublisherRow, PublisherAvatar,
  Actions, PrimaryButton, DangerOutlineButton,
} from '../PublicationDetailPage.styles';


interface Props {
  publication: Publication;
  isOwner: boolean;
  isActive: boolean;
  cancelling: boolean;
  onCancelClick: () => void;
  onProposeClick: () => void;
}

export default function PublicationSummaryCard({
  publication, isOwner, isActive, cancelling, onCancelClick, onProposeClick,
}: Props) {
  const consumedPct = publication.initialCount > 0
    ? ((publication.initialCount - publication.remainingCount) / publication.initialCount) * 100
    : 0;

  return (
    <PublicationCard>
      <TopRow>
        <CardInfo>
          <CardTitle><b>{publication.card.id}</b> · {publication.card.description}</CardTitle>
          <CardMeta>
            {[publication.card.country, publication.card.team, publication.card.category]
              .filter(Boolean)
              .join(' · ')}
          </CardMeta>
        </CardInfo>
        <StatusBadge tone={PUB_TONE[publication.status]} size="md">
          {PUB_STATUS_LABEL[publication.status]}
        </StatusBadge>
      </TopRow>

      <CountSection>
        <CountLabel>
          Quedan <CountValue>{publication.remainingCount}</CountValue> de{' '}
          <CountValue>{publication.initialCount}</CountValue> disponibles
        </CountLabel>
        <ProgressTrack>
          <ProgressFill $pct={consumedPct} />
        </ProgressTrack>
      </CountSection>

      {!isOwner && (
        <PublisherRow>
          <PublisherAvatar src="/assets/user-svgrepo-com.svg" alt={publication.publisher.name} />
          Publicado por <strong>{publication.publisher.name}</strong>
          {publication.publisher.rating !== null && (
            <span>· ★ {publication.publisher.rating.toFixed(1)}</span>
          )}
        </PublisherRow>
      )}

      <Actions>
        {isOwner && isActive && (
          <DangerOutlineButton onClick={onCancelClick} disabled={cancelling}>
            {cancelling ? 'Cancelando...' : 'Cancelar publicación'}
          </DangerOutlineButton>
        )}
        {!isOwner && isActive && publication.remainingCount > 0 && (
          <PrimaryButton onClick={onProposeClick}>
            Hacer propuesta
          </PrimaryButton>
        )}
      </Actions>
    </PublicationCard>
  );
}
