import { useEffect, useState } from 'react';
import { getTopExchangedCards, TopExchangedCardEntry } from '../../../api/AdminStatsService';
import {
  TimeseriesCard, TimeseriesTitle,
  HighlightList, HighlightItem, HighlightItemLabel, HighlightItemCount, HighlightEmpty,
} from '../AdminDashboardPage.styles';

// Capa 3 — top de cartas más intercambiadas (cada aparición en cardsFromA/B suma 1).
export default function TopExchangedCardsPanel() {
  const [data, setData] = useState<TopExchangedCardEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopExchangedCards(7)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TimeseriesCard>
      <TimeseriesTitle>Cartas más intercambiadas — últimos 7 días</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data || data.length === 0
          ? <HighlightEmpty>Sin intercambios en el período.</HighlightEmpty>
          : (
            <HighlightList>
              {data.map(e => (
                <HighlightItem key={e.cardId}>
                  <HighlightItemLabel>
                    <b>{e.cardId}</b> · {e.cardDescription}
                  </HighlightItemLabel>
                  <HighlightItemCount>{e.occurrences}</HighlightItemCount>
                </HighlightItem>
              ))}
            </HighlightList>
          )}
    </TimeseriesCard>
  );
}
