export type ExchangeOriginType = 'PROPUESTA' | 'SUBASTA';

export interface ExchangeOrigin {
  type: ExchangeOriginType;
  /** id de la Proposal o Auction de origen */
  id: string;
}
