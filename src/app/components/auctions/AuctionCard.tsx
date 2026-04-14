import React from 'react';
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
}


export default function AuctionCardComponent({ auction: auction, onBid }: AuctionCardProps) {

  const calcularTiempoRestante = () => {
    const ahora = new Date();
    const diferencia = new Date(auction.fechaCierre).getTime() - ahora.getTime();

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
  const reputacionMinima = auction.condicionesMinimas.find(c => c.tipo === 'REPUTATION_MINIMA')?.valor || 4;

  return (
    <AuctionCard>
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
        <span className="seller-name">{auction.publicante.nombre}</span>
        <span className="reputation">
          {'★'.repeat(Math.round(auction.publicante.rating || 4))}
          {' '}
          <span style={{ color: '#666' }}>
            ({(auction.publicante.rating || 0).toFixed(1)})
          </span>
        </span>
      </SellerInfo>

      <AuctionStatus>
        <span>Tiempo restante:</span>
        <TimeRemaining color={tiempoRestante.color}>
          {tiempoRestante.texto}
        </TimeRemaining>
      </AuctionStatus>

      {auction.mejorApuesta && (
        <BestBidInfo>
          <div className="bid-label">Mejor oferta:</div>
          <div className="bid-details">
            {auction.mejorApuesta.figuritasOfrecidas.length} figurita(s) ofrecidas
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
            Por {auction.mejorApuesta.postor.nombre}
          </div>
        </BestBidInfo>
      )}

      <RequirmentsInfo>
        <div className="requirement">
          <span className="label">Reputación mínima:</span>
          <span className="value">{reputacionMinima} ⭐</span>
        </div>
      </RequirmentsInfo>
      <BidButton onClick={onBid}>
        Ofertar
      </BidButton>
    </AuctionCard>
  );
}
