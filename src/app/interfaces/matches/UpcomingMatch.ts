// Próximo partido del Mundial, tal como lo devuelve nuestro BE (ya mapeado desde API-Football).
// `kickoff` viene en ISO-8601 UTC (e.g. 2026-06-11T19:00:00Z) → `new Date(kickoff)` sin ambigüedad.
export interface UpcomingMatch {
  homeTeam: string | null;
  homeCrest: string | null;
  awayTeam: string | null;
  awayCrest: string | null;
  kickoff: string | null;
  venue: string | null;
  round: string | null;
}
