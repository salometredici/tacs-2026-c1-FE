import { Auction } from '../../../interfaces/auctions/Auction';
import ConfirmDialog from '../../../components/feedback/ConfirmDialog';
import { WarningBox, ExchangeSummary } from '../AuctionDetailPage.styles';
import SummaryRow from './SummaryRow';

interface Props {
  open: boolean;
  auction: Auction;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelAuctionConfirmDialog({ open, auction, loading, onCancel, onConfirm }: Props) {
  const activeBidsCount = auction.bids.filter(o => o.status === 'ACTIVA').length;
  return (
    <ConfirmDialog
      open={open}
      title="¿Cancelar la subasta?"
      cancelLabel="Volver"
      confirmLabel="Sí, cancelar subasta"
      loadingLabel="Cancelando..."
      loading={loading}
      destructive
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <WarningBox>
        Esta acción es irreversible. La subasta quedará cancelada y todas las ofertas recibidas serán descartadas.
      </WarningBox>
      <ExchangeSummary>
        <SummaryRow label="Subasta">#{auction.card.number} {auction.card.description}</SummaryRow>
        <SummaryRow label="Ofertas que se descartarán">{activeBidsCount}</SummaryRow>
      </ExchangeSummary>
    </ConfirmDialog>
  );
}
