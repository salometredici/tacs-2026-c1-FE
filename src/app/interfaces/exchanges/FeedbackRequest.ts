/**
 * Body que se envía a `POST /api/exchanges/{exchangeId}/feedback`.
 * Coincide con `AddFeedbackDto` del BE.
 */
export interface FeedbackRequest {
  score: number;
  comment?: string;
}
