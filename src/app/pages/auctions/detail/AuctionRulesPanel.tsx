import { Auction } from '../../../interfaces/auctions/Auction';
import { RULE_LABELS } from '../../../interfaces/auctions/auctionRule/AuctionRule';
import {
  Card, SectionTitle, HintText, RuleItem, BidButton, DangerBidButton, InterestButton,
} from '../AuctionDetailPage.styles';

interface Props {
  rules: Auction['rules'];
  isOwner: boolean;
  isActive: boolean;
  onPlaceBid: () => void;
  onCancelAuction: () => void;
  onMarkInterested?: () => void;
  interested?: boolean;
  markingInterested?: boolean;
}

export default function AuctionRulesPanel({
  rules, isOwner, isActive, onPlaceBid, onCancelAuction,
  onMarkInterested, interested = false, markingInterested = false,
}: Props) {
  return (
    <Card>
      <SectionTitle>Condiciones de participación</SectionTitle>
      {rules.length === 0 ? (
        <HintText>Sin restricciones — cualquiera puede ofertar.</HintText>
      ) : (
        rules.map(r => (
          <RuleItem key={r.type}>
            <strong>{RULE_LABELS[r.type] ?? r.type}:</strong> {r.value}
          </RuleItem>
        ))
      )}
      {isActive && !isOwner && (
        <BidButton onClick={onPlaceBid}>Hacer oferta</BidButton>
      )}
      {isActive && !isOwner && onMarkInterested && (
        <InterestButton
          onClick={onMarkInterested}
          disabled={interested || markingInterested}
        >
          <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
          {interested ? 'Te avisaremos al cerrar' : markingInterested ? 'Enviando...' : 'Me interesa'}
        </InterestButton>
      )}
      {isActive && isOwner && (
        <DangerBidButton onClick={onCancelAuction}>Cancelar subasta</DangerBidButton>
      )}
    </Card>
  );
}
