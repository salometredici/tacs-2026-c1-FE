import { useNavigate } from 'react-router-dom';
import { Proposal } from '../../../interfaces/proposals/Proposal';
import SectionHeader from '../../../components/common/SectionHeader';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { RowList, OutlinedListItem, SeeAllLink, Divider } from '../ProfilePage.styles';

const STATUS_LABEL = { PENDIENTE: 'Pendiente', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada', CANCELADA: 'Cancelada' } as const;
const STATUS_TONE = { PENDIENTE: 'warning', ACEPTADA: 'success', RECHAZADA: 'error', CANCELADA: 'error' } as const;
const PREVIEW = 3;

interface Props {
  received: Proposal[];
  sent: Proposal[];
  onSelect: (proposal: Proposal) => void;
}

export default function ProposalsTab({ received, sent, onSelect }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        title="Recibidas"
        count={received.length}
        action={received.length > PREVIEW && (
          <SeeAllLink onClick={() => navigate('/proposals')}>Ver todas →</SeeAllLink>
        )}
      />
      {received.length === 0 ? (
        <EmptyState>No tenés propuestas recibidas.</EmptyState>
      ) : (
        <RowList>
          {received.slice(0, PREVIEW).map(p => (
            <OutlinedListItem key={p.id} onClick={() => onSelect(p)}>
              <div>
                <strong>Por {p.requestedCount}× #{p.publication.card.number} {p.publication.card.description}</strong>
                <span>De {p.bidder.name} · Te ofrece {p.offeredCards.length} figurita{p.offeredCards.length === 1 ? '' : 's'}</span>
              </div>
              <StatusBadge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</StatusBadge>
            </OutlinedListItem>
          ))}
        </RowList>
      )}

      <Divider />

      <SectionHeader
        title="Enviadas"
        count={sent.length}
        action={sent.length > PREVIEW && (
          <SeeAllLink onClick={() => navigate('/proposals')}>Ver todas →</SeeAllLink>
        )}
      />
      {sent.length === 0 ? (
        <EmptyState>No tenés propuestas enviadas.</EmptyState>
      ) : (
        <RowList>
          {sent.slice(0, PREVIEW).map(p => (
            <OutlinedListItem key={p.id} onClick={() => onSelect(p)}>
              <div>
                <strong>Por {p.requestedCount}× #{p.publication.card.number} {p.publication.card.description}</strong>
                <span>A {p.publication.publisher.name} · Ofrecés {p.offeredCards.length} figurita{p.offeredCards.length === 1 ? '' : 's'}</span>
              </div>
              <StatusBadge tone={STATUS_TONE[p.status]}>{STATUS_LABEL[p.status]}</StatusBadge>
            </OutlinedListItem>
          ))}
        </RowList>
      )}
    </>
  );
}
