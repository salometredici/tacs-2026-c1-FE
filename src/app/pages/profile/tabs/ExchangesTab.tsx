import { useNavigate } from 'react-router-dom';
import { Exchange } from '../../../interfaces/exchanges/Exchange';
import { viewAs } from '../../../utils/exchangeView';
import SectionHeader from '../../../components/common/SectionHeader';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { RowList, OutlinedListItem, SeeAllLink } from '../ProfilePage.styles';

const ORIGIN_LABEL = { PROPUESTA: 'Propuesta', SUBASTA: 'Subasta' } as const;
const PREVIEW = 3;

interface Props {
  userId: string;
  exchanges: Exchange[];
  onSelect: (exchange: Exchange) => void;
}

export default function ExchangesTab({ userId, exchanges, onSelect }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        title="Histórico"
        count={exchanges.length}
        action={exchanges.length > PREVIEW && (
          <SeeAllLink onClick={() => navigate('/exchanges')}>Ver todos →</SeeAllLink>
        )}
      />
      {exchanges.length === 0 ? (
        <EmptyState>No tenés intercambios concretados todavía.</EmptyState>
      ) : (
        <RowList>
          {exchanges.slice(0, PREVIEW).map(ex => {
            const v = viewAs(ex, userId);
            const headlineCard = v.theirCards[0];
            const extras = v.theirCards.length - 1;
            const extraText = extras === 0 ? '' : extras === 1 ? ' y otra figurita' : ` y otras ${extras} figuritas`;
            return (
              <OutlinedListItem key={ex.id} onClick={() => onSelect(ex)}>
                <div>
                  {headlineCard
                    ? <strong>{headlineCard.cardId} {headlineCard.description}{extraText}</strong>
                    : <strong>Intercambio</strong>
                  }
                  <span>
                    Recibidas de {v.other.name} · {new Date(ex.createdAt).toLocaleDateString('es-AR')} · {ORIGIN_LABEL[ex.origin.type]}
                  </span>
                </div>
                <StatusBadge
                  tone={v.myFeedback ? 'success' : 'neutral'}
                  icon={v.myFeedback ? <span className="material-symbols-outlined" aria-hidden="true">check</span> : undefined}
                >
                  {v.myFeedback ? 'Calificado' : 'Sin calificar'}
                </StatusBadge>
              </OutlinedListItem>
            );
          })}
        </RowList>
      )}
    </>
  );
}
