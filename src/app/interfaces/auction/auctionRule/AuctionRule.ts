import { BidRuleType } from './AuctionRuleType';

export interface AuctionRule {
  type: BidRuleType;
  value: string;
}

export const RULE_LABELS: Record<string, string> = {
  REPUTACION_MINIMA: 'Reputación mínima',
  INTERCAMBIOS_MINIMOS: 'Intercambios mínimos',
  CANTIDAD_MINIMA_FIGURITAS: 'Figuritas mínimas en oferta',
  CATEGORIA_MINIMA: 'Categoría mínima de figuritas',
};