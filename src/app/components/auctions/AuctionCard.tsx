import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auction/Auction';
import {
  AuctionCard,
  FiguritaInfo,
  FiguritaNumber,
  FiguritaDetails,
  SellerInfo,
  StarsRating,
  AuctionStatus,
  TimeRemaining,
  BestBidInfo,
  RequirmentsInfo,
  BidButton,
} from './Auctions.styles';

interface AuctionCardProps {
  auction: Auction;
  onBid: () => void;
  hideBidButton?: boolean;
}


export default function AuctionCardComponent({ auction, onBid, hideBidButton = false }: AuctionCardProps) {
  const navigate = useNavigate();

  const calcularTiempoRestante = () => {
    const ahora = new Date();
    const diferencia = new Date(auction.endDate).getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return { texto: 'Finalizada', color: '#d32f2f' };
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (dias > 0) {
      return { texto: `${dias}d ${horas}h`, color: '#388e3c' };
    } else if (horas > 1) {
      return { texto: `${horas}h`, color: '#388e3c' };
    } else {
      return { texto: 'Termina pronto', color: '#f57c00' };
    }
  };

  const tiempoRestante = calcularTiempoRestante();
  const reputacionMinima = auction.rules.find(c => c.type === 'REPUTACION_MINIMA')?.value;

  return (
    <AuctionCard onClick={() => navigate(`/auctions/${auction.id}`)} style={{ cursor: 'pointer' }}>
      <FiguritaInfo>
        <FiguritaNumber>#{auction.figurita.numero}</FiguritaNumber>
        <FiguritaDetails>
          <p>
            <strong>{auction.figurita.jugador}</strong>
          </p>
          <p>{auction.figurita.seleccion} - {auction.figurita.equipo}</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Categoría: <span style={{ color: '#1976d2' }}>{auction.figurita.categoria}</span>
          </p>
        </FiguritaDetails>
      </FiguritaInfo>

      <SellerInfo>
        <span>Publicante:</span>
        <span className="seller-name">{auction.publisherId.nombre}</span>
        <span className="reputation">
          {'★'.repeat(Math.round(auction.publisherId.rating || 4))}
          {' '}
          <span style={{ color: '#666' }}>
            ({(auction.publisherId.rating || 0).toFixed(1)})
          </span>
        </span>
      </SellerInfo>

      <AuctionStatus>
        <span>Tiempo restante:</span>
        <TimeRemaining color={tiempoRestante.color}>
          {tiempoRestante.texto}
        </TimeRemaining>
      </AuctionStatus>

      {auction.lastBidId && (() => {
        const mejor = auction.bids.find(o => o.bidId === auction.lastBidId);
        return mejor ? (
          <BestBidInfo>
            <div className="bid-label">Última oferta:</div>
            <div className="bid-details">
              {mejor.offeredFiguritas.length} figurita(s) ofrecidas
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
              Por {mejor.postor.name}
            </div>
          </BestBidInfo>
        ) : null;
      })()}

      <RequirmentsInfo>
        {reputacionMinima && (
          <div className="requirement">
            <span className="label">Reputación mínima:</span>
            <span className="value">{reputacionMinima} ⭐</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'INTERCAMBIOS_MINIMOS') && (
          <div className="requirement">
            <span className="label">Intercambios mínimos:</span>
            <span className="value">{auction.rules.find(r => r.type === 'INTERCAMBIOS_MINIMOS')!.value}</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'CANTIDAD_MINIMA_FIGURITAS') && (
          <div className="requirement">
            <span className="label">Figuritas mínimas en oferta:</span>
            <span className="value">{auction.rules.find(r => r.type === 'CANTIDAD_MINIMA_FIGURITAS')!.value}</span>
          </div>
        )}
        {auction.rules.find(r => r.type === 'CATEGORIA_MINIMA') && (
          <div className="requirement">
            <span className="label">Categoría mínima:</span>
            <span className="value">{auction.rules.find(r => r.type === 'CATEGORIA_MINIMA')!.value}</span>
          </div>
        )}
        {auction.rules.length === 0 && (
          <div className="requirement">
            <span className="label">Sin restricciones</span>
          </div>
        )}
      </RequirmentsInfo>
      {!hideBidButton && (
        <BidButton onClick={e => { e.stopPropagation(); onBid(); }}>
          Ofertar
        </BidButton>
      )}
    </AuctionCard>
  );
}
