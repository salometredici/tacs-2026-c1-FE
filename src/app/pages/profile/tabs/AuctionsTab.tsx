import { useNavigate } from 'react-router-dom';
import { Auction } from '../../../interfaces/auctions/Auction';
import { UserBid } from '../../../interfaces/auctions/bid/UserBid';
import SectionHeader from '../../../components/common/SectionHeader';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import { SectionActionButton } from '../../../components/auctions/Auctions.styles';
import { RowList, OutlinedListItem, SeeAllLink, Divider, HeaderActions } from '../ProfilePage.styles';
import { AUCTION_STATUS_LABEL as STATUS_LABEL, AUCTION_STATUS_TONE as STATUS_TONE } from '../../../interfaces/auctions/AuctionStatus';

const PREVIEW = 5;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

interface Props {
  myAuctions: Auction[];
  myOffers: UserBid[];
}

export default function AuctionsTab({ myAuctions, myOffers }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <SectionHeader
        title="Mis Subastas"
        count={myAuctions.length}
        action={
          <HeaderActions>
            {myAuctions.length > 0 && (
              <SeeAllLink onClick={() => navigate('/auctions')}>Ver todas →</SeeAllLink>
            )}
            <SectionActionButton onClick={() => navigate('/auctions/create')}>
              <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
              Crear Subasta
            </SectionActionButton>
          </HeaderActions>
        }
      />
      {myAuctions.length === 0 ? (
        <EmptyState>No tenés subastas publicadas.</EmptyState>
      ) : (
        <RowList>
          {myAuctions.slice(0, PREVIEW).map(a => (
            <OutlinedListItem key={a.id} onClick={() => navigate(`/auctions/${a.id}`)}>
              <div>
                <strong><b>{a.card.id}</b> - {a.card.description}</strong>
                <span>Cierra {fmtDate(a.endDate)}</span>
              </div>
              <StatusBadge tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</StatusBadge>
            </OutlinedListItem>
          ))}
        </RowList>
      )}

      <Divider />

      <SectionHeader
        title="Mis Ofertas"
        count={myOffers.length}
        action={myOffers.length > 0 && (
          <SeeAllLink onClick={() => navigate('/auctions')}>Ver todas →</SeeAllLink>
        )}
      />
      {myOffers.length === 0 ? (
        <EmptyState>No tenés ofertas en subastas.</EmptyState>
      ) : (
        <RowList>
          {myOffers.slice(0, PREVIEW).map(o => (
            <OutlinedListItem key={o.bidId} onClick={() => navigate(`/auctions/${o.auctionId}`)}>
              <div>
                <strong><b>{o.card.id}</b> - {o.card.description}</strong>
                <span>De {o.publisher.name} · Cierra {fmtDate(o.closingDate)}</span>
              </div>
              <StatusBadge tone={o.auctionStatus === 'ACTIVA' ? 'success' : 'neutral'}>
                {o.auctionStatus === 'ACTIVA' ? 'Activa' : 'Cerrada'}
              </StatusBadge>
            </OutlinedListItem>
          ))}
        </RowList>
      )}
    </>
  );
}
