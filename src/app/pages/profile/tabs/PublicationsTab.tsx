import { useNavigate } from 'react-router-dom';
import { Publication } from '../../../interfaces/publications/Publication';
import SectionHeader from '../../../components/common/SectionHeader';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { SectionActionButton } from '../../../components/auctions/Auctions.styles';
import { RowList, OutlinedListItem } from '../ProfilePage.styles';

const STATUS_LABEL = { ACTIVA: 'Activa', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' } as const;
const STATUS_TONE = { ACTIVA: 'success', FINALIZADA: 'neutral', CANCELADA: 'error' } as const;

interface Props {
  publications: Publication[];
  onPublish: () => void;
}

export default function PublicationsTab({ publications, onPublish }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        title="Mis Publicaciones"
        count={publications.length}
        action={
          <SectionActionButton onClick={onPublish}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            Publicar Figurita
          </SectionActionButton>
        }
      />
      {publications.length === 0 ? (
        <EmptyState>No tenés publicaciones realizadas.</EmptyState>
      ) : (
        <RowList>
          {publications.map(pub => (
            <OutlinedListItem key={pub.id} onClick={() => navigate(`/publications/${pub.id}`)}>
              <div>
                <strong>#{pub.card.number} {pub.card.description}</strong>
                <span>Quedan {pub.remainingCount} de {pub.initialCount}</span>
              </div>
              <StatusBadge tone={STATUS_TONE[pub.status]}>
                {STATUS_LABEL[pub.status]}
              </StatusBadge>
            </OutlinedListItem>
          ))}
        </RowList>
      )}
    </>
  );
}
