import { Auction } from '../../../interfaces/auctions/Auction';
import { RULE_LABELS } from '../../../interfaces/auctions/auctionRule/AuctionRule';
import {
  Card, SectionTitle, HintText, RuleItem, BidButton, DangerBidButton,
} from '../AuctionDetailPage.styles';

interface Props {
  rules: Auction['rules'];
  isOwner: boolean;
  isActive: boolean;
  onPlaceBid: () => void;
  onCancelAuction: () => void;
}

export default function AuctionRulesPanel({ rules, isOwner, isActive, onPlaceBid, onCancelAuction }: Props) {
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
      {isActive && isOwner && (
        <DangerBidButton onClick={onCancelAuction}>Cancelar subasta</DangerBidButton>
      )}
    </Card>
  );
}
