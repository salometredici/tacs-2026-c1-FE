import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auction } from '../../interfaces/auction/Auction';
import { getActiveAuctions } from '../../api/AuctionsService';
import AuctionCard from '../../components/auctions/AuctionCard';
import PlaceBidModal from '../../components/auctions/PlaceBidModal';
import { useUserContext } from '../../context/useUserContext';
import {
  AuctionsContainer,
  AuctionsHeader,
  AuctionsTitle,
  CreateButton,
  AuctionsGrid,
  LoadingMessage,
  EmptyMessage,
} from '../../components/auctions/Auctions.styles';

export default function AuctionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const [subastas, setSubastas] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [subastaSeleccionada, setSubastaSeleccionada] = useState<Auction | null>(null);


  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    setLoading(true);
    getActiveAuctions()
    .then(data => setSubastas(data))
    .catch(_ => { // El error se loguea en el service, acá sólo actualizamos el state
      setSubastas([]);
    })
    .finally(() => setLoading(false));
  };

  return (
    <AuctionsContainer>
      <AuctionsHeader>
        <AuctionsTitle>Subastas Activas</AuctionsTitle>
        <CreateButton onClick={() => navigate('/auctions/create')}>
          + Crear Subasta
        </CreateButton>
      </AuctionsHeader>

      {loading ? (
        <LoadingMessage>Cargando subastas...</LoadingMessage>
      ) : subastas.length === 0 ? (
        <EmptyMessage>No hay subastas activas en este momento</EmptyMessage>
      ) : (
        <>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Se encontraron {subastas.length} subasta(s) activa(s)
          </p>
          <AuctionsGrid>
            {subastas.map(subasta => (
              <AuctionCard key={subasta.id} auction={subasta} onBid={() => setSubastaSeleccionada(subasta)} />
            ))}
          </AuctionsGrid>
        </>
      )}
      {subastaSeleccionada && currentUser && (
        <PlaceBidModal
          userId={currentUser.id}
          figurita={subastaSeleccionada.figurita}
          auctionId={subastaSeleccionada.id}
          onClose={() => setSubastaSeleccionada(null)}
          onSuccess={() => setSubastaSeleccionada(null)}
        />
      )}
    </AuctionsContainer>
  );
}
