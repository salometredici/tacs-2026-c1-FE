import { Auction } from '../../../interfaces/auctions/Auction';
import { Bid } from '../../../interfaces/auctions/bid/Bid';
import ConfirmDialog from '../../../components/feedback/ConfirmDialog';
import { WarningBox, ExchangeSummary } from '../AuctionDetailPage.styles';
import SummaryRow from './SummaryRow';

interface Props {
  open: boolean;
  auction: Auction;
  bid: Bid | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AcceptOfferConfirmDialog({ open, auction, bid, loading, onCancel, onConfirm }: Props) {
  return (
    <ConfirmDialog
      open={open}
      title="¿Confirmar oferta ganadora?"
      cancelLabel="Cancelar"
      confirmLabel="Confirmar y finalizar"
      loadingLabel="Finalizando..."
      loading={loading}
      destructive
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <WarningBox>
        Esta decisión es irreversible. Al confirmar, la subasta quedará finalizada
        y se generará un intercambio con el postor seleccionado.
      </WarningBox>
      {bid && (
        <ExchangeSummary>
          <SummaryRow label="Vos entregás">
            #{auction.card.number} {auction.card.description}
          </SummaryRow>
          <SummaryRow label={`Recibís de ${bid.bidder.name}`}>
            {bid.offeredCards.map(f => `#${f.number} ${f.description}`).join(', ')}
          </SummaryRow>
          <SummaryRow label="Rating del postor">
            {'★'.repeat(Math.round(bid.bidder.rating))} ({bid.bidder.rating.toFixed(1)})
          </SummaryRow>
        </ExchangeSummary>
      )}
    </ConfirmDialog>
  );
}
