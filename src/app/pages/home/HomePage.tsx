import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Publicacion } from '../../interfaces/publicaciones/Publicacion';
import { getUserSuggestions } from '../../api/UsersService';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../../components/proposals/MakeProposalModal';
import {
  HomeContainer,
  Title,
  Subtitle,
  CardsGrid,
  Card,
  CardTitle,
  CardDescription,
  SugerenciasSection,
  SugerenciasTitle,
  SugerenciasCarousel,
  SugerenciaCard,
  CategoriaBadge,
  CardNumber,
  CardPlayer,
  CardMeta,
  CardOwner,
  EmptyMessage,
} from './HomePage.styles';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  const [sugerencias, setSugerencias] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [seleccionada, setSeleccionada] = useState<Publicacion | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getUserSuggestions(currentUser.id)
      .then(data => setSugerencias(data))
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <HomeContainer>
      <Title>Bienvenido!</Title>
      <Subtitle>Intercambia figuritas con otros coleccionistas</Subtitle>

      {currentUser && (
        <SugerenciasSection>
          <SugerenciasTitle>Sugerencias para vos</SugerenciasTitle>

          {loading ? (
            <EmptyMessage>Cargando sugerencias...</EmptyMessage>
          ) : sugerencias.length === 0 ? (
            <EmptyMessage>No hay sugerencias disponibles por ahora.</EmptyMessage>
          ) : (
            <SugerenciasCarousel>
              {sugerencias.map(s => (
                <SugerenciaCard key={s.id} onClick={() => setSeleccionada(s)}>
                  <CategoriaBadge $categoria={s.figurita.category}>
                    {s.figurita.category}
                  </CategoriaBadge>
                  <CardNumber>#{s.figurita.number}</CardNumber>
                  <CardPlayer>{s.figurita.description}</CardPlayer>
                  <CardMeta>{s.figurita.country}</CardMeta>
                  <CardOwner>Ofrecida por {s.publisher.name}</CardOwner>
                </SugerenciaCard>
              ))}
            </SugerenciasCarousel>
          )}
        </SugerenciasSection>
      )}

      <CardsGrid>
        <Card onClick={() => navigate('/search')}>
          <CardTitle>Búsqueda de Figuritas</CardTitle>
          <CardDescription>
            Busca figuritas por número, jugador, selección o equipo
          </CardDescription>
        </Card>
        <Card onClick={() => navigate('/auctions')}>
          <CardTitle>Subastas Activas</CardTitle>
          <CardDescription>
            Buscá subastas activas o inicia las tuyas
          </CardDescription>
        </Card>
      </CardsGrid>

      {seleccionada && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          figurita={seleccionada.figurita}
          publicacionId={seleccionada.id}
          onClose={() => setSeleccionada(null)}
          onSuccess={() => {
            setSugerencias(prev => prev.filter(s => s.id !== seleccionada!.id));
            setSeleccionada(null);
          }}
        />
      )}
    </HomeContainer>
  );
}
