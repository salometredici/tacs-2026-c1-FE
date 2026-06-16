import { MissingCard } from '../../../interfaces/cards/MissingCard';
import { addToUserCollection } from '../../../api/UsersService';
import { formatTimeAgo } from '../../../utils/utils';
import { useSnackbar } from '../../../context/useSnackbar';
import SectionHeader from '../../../components/common/SectionHeader';
import EmptyState from '../../../components/common/EmptyState';
import {
  CollectionContainer, CardItem, CardImage,
} from '../../../components/collection/Collection.styles';
import { SectionActionButton } from '../../../components/auctions/Auctions.styles';
import { MarkAsAcquiredButton } from '../ProfilePage.styles';

interface Props {
  userId: string;
  missing: MissingCard[];
  onAdd: () => void;
  onRefetch: () => void;
}

export default function MissingTab({ userId, missing, onAdd, onRefetch }: Props) {
  const { showError } = useSnackbar();

  const handleMarkAcquired = async (cardId: string) => {
    // "Ya la conseguí" = agregar a colección. El BE limpia missingCards al hacer
    // addToCollection (idempotente)
    try {
      await addToUserCollection(userId, cardId);
      onRefetch();
    } catch {
      showError('No se pudo agregar a la colección. Intentá de nuevo.');
    }
  };

  return (
    <>
      <SectionHeader
        title="Mis faltantes"
        count={missing.length}
        action={
          <SectionActionButton onClick={onAdd}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            Agregar Faltantes
          </SectionActionButton>
        }
      />
      {missing.length === 0 ? (
        <EmptyState>No tenés figuritas faltantes.</EmptyState>
      ) : (
        <CollectionContainer>
          {missing.map(card => (
            <CardItem key={card.cardId}>
              <CardImage $category={card.category}>
                <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
              </CardImage>
              <h4><b>{card.cardId}</b></h4>
              <p><strong>{card.description}</strong></p>
              <p>{[card.country, card.team].filter(Boolean).join(' · ')}</p>
              <p>{card.category}</p>
              {card.addedAt && (
                <p>Buscás esta {formatTimeAgo(card.addedAt)}</p>
              )}
              <MarkAsAcquiredButton
                type="button"
                onClick={() => handleMarkAcquired(card.cardId)}
                title="Ya la conseguí"
              >
                <span className="material-symbols-outlined" aria-hidden="true">check</span>
                Ya la conseguí
              </MarkAsAcquiredButton>
            </CardItem>
          ))}
        </CollectionContainer>
      )}
    </>
  );
}
