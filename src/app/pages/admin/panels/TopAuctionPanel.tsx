import { useEffect, useState } from 'react';
import { getTopAuctionByOffers, TopAuctionByOffersEntry } from '../../../api/AdminStatsService';
import {
  TimeseriesCard, TimeseriesTitle,
  HighlightEmpty, HighlightCallout, HighlightCalloutTitle, HighlightCalloutSubtitle, HighlightCalloutCount,
} from '../AdminDashboardPage.styles';

// Capa 3 — subasta activa con más ofertas PENDING (la "trending" del momento).
export default function TopAuctionPanel() {
  const [data, setData] = useState<TopAuctionByOffersEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopAuctionByOffers()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TimeseriesCard>
      <TimeseriesTitle>Subasta con más ofertas pendientes</TimeseriesTitle>
      {loading
        ? <HighlightEmpty>Cargando…</HighlightEmpty>
        : !data
          ? <HighlightEmpty>No hay subastas activas con ofertas.</HighlightEmpty>
          : (
            <HighlightCallout>
              <HighlightCalloutCount>{data.pendingOffers}</HighlightCalloutCount>
              <HighlightCalloutTitle><b>{data.cardId}</b> · {data.cardDescription}</HighlightCalloutTitle>
              <HighlightCalloutSubtitle>
                Subastada por {data.publisherName} · {data.totalOffers} oferta{data.totalOffers === 1 ? '' : 's'} en total
              </HighlightCalloutSubtitle>
            </HighlightCallout>
          )}
    </TimeseriesCard>
  );
}
