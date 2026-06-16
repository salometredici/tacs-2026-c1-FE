import { useEffect, useState } from 'react';
import { getMostWantedCards, MostWantedCardEntry } from '../../../api/AdminStatsService';
import {
  TimeseriesCard, TimeseriesTitle,
  HighlightList, HighlightItem, HighlightItemLabel, HighlightItemCount, HighlightEmpty,
} from '../AdminDashboardPage.styles';

// Capa 3 — top de cartas marcadas como "faltantes" en los últimos N días.
// El BE cachea con TTL 5min; este componente solo renderiza.
export default function MostWantedCardsPanel() {
  const [data, setData] = useState<MostWantedCardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMostWantedCards(7)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TimeseriesCard>
      <TimeseriesTitle>Más buscadas en faltantes — últimos 7 días</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data || data.length === 0
          ? <HighlightEmpty>Sin datos en el período.</HighlightEmpty>
          : (
            <HighlightList>
              {data.map(e => (
                <HighlightItem key={e.cardId}>
                  <HighlightItemLabel>
                    <b>{e.cardId}</b> · {e.cardDescription}
                  </HighlightItemLabel>
                  <HighlightItemCount>{e.userCount}</HighlightItemCount>
                </HighlightItem>
              ))}
            </HighlightList>
          )}
    </TimeseriesCard>
  );
}
