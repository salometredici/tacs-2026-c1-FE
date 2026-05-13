import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Publication } from '../../interfaces/publications/Publication';
import { getUserSuggestions } from '../../api/UsersService';
import { useUserContext } from '../../context/useUserContext';
import MakeProposalModal from '../../components/proposals/MakeProposalModal';
import {
  HomeContainer,
  Title,
  Subtitle,
  CardsGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  SuggestionsSection,
  SuggestionsTitle,
  CarouselWrapper,
  CarouselArrow,
  SuggestionsCarousel,
  SuggestionCard,
  CategoryBadge,
  CardNumber,
  CardPlayer,
  CardMeta,
  CardOwner,
  EmptyMessage,
} from './HomePage.styles';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();

  const [suggestions, setSuggestions] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Publication | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getUserSuggestions(currentUser.id)
      .then(data => setSuggestions(data))
      .finally(() => setLoading(false));
  }, [currentUser]);

  useEffect(() => {
    if (suggestions.length === 0) return;
    const interval = setInterval(() => {
      if (!isDragging.current && carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 4) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 196, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    dragScrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
    carouselRef.current?.classList.add('dragging');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - dragStartX.current) * 1.5;
    if (carouselRef.current) carouselRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    carouselRef.current?.classList.remove('dragging');
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
  };

  return (
    <HomeContainer>
      <Title>¡Bienvenido{currentUser?.name ? `, ${currentUser.name}` : ''}!</Title>
      <Subtitle>Intercambia figuritas con otros coleccionistas</Subtitle>

      {currentUser && (
        <SuggestionsSection>
          <SuggestionsTitle>Sugerencias para vos</SuggestionsTitle>

          {loading ? (
            <EmptyMessage>Cargando sugerencias...</EmptyMessage>
          ) : suggestions.length === 0 ? (
            <EmptyMessage>No hay sugerencias disponibles por ahora.</EmptyMessage>
          ) : (
            <CarouselWrapper>
              <CarouselArrow $side="left" onClick={() => scrollCarousel('left')} aria-label="Anterior">
                <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
              </CarouselArrow>
              <SuggestionsCarousel
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {suggestions.map(s => (
                  <SuggestionCard key={s.id} onClick={() => { if (!isDragging.current) setSelected(s); }}>
                    <CategoryBadge $category={s.card.category}>
                      {s.card.category}
                    </CategoryBadge>
                    <CardNumber>#{s.card.number}</CardNumber>
                    <CardPlayer>{s.card.description}</CardPlayer>
                    <CardMeta>{s.card.country}</CardMeta>
                    <CardOwner>Ofrecida por {s.publisher.name}</CardOwner>
                  </SuggestionCard>
                ))}
              </SuggestionsCarousel>
              <CarouselArrow $side="right" onClick={() => scrollCarousel('right')} aria-label="Siguiente">
                <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </CarouselArrow>
            </CarouselWrapper>
          )}
        </SuggestionsSection>
      )}

      <CardsGrid>
        <Card onClick={() => navigate('/catalog')}>
          <CardIcon>
            <span className="material-symbols-outlined" aria-hidden="true">view_list</span>
          </CardIcon>
          <CardTitle>Catálogo de Figuritas</CardTitle>
          <CardDescription>
            Explorá las 500 figuritas del Mundial y filtrá por categoría
          </CardDescription>
        </Card>
        <Card onClick={() => navigate('/search')}>
          <CardIcon>
            <span className="material-symbols-outlined" aria-hidden="true">search</span>
          </CardIcon>
          <CardTitle>Búsqueda de Figuritas</CardTitle>
          <CardDescription>
            Buscá la figurita que te interese en publicaciones y subastas activas
          </CardDescription>
        </Card>
        <Card onClick={() => navigate('/auctions')}>
          <CardIcon>
            <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
          </CardIcon>
          <CardTitle>Subastas Activas</CardTitle>
          <CardDescription>
            Buscá subastas activas o iniciá las tuyas
          </CardDescription>
        </Card>
      </CardsGrid>

      {selected && currentUser && (
        <MakeProposalModal
          userId={currentUser.id}
          card={selected.card}
          publicationId={selected.id}
          maxRequestable={selected.remainingCount}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSuggestions(prev => prev.filter(s => s.id !== selected!.id));
            setSelected(null);
          }}
        />
      )}
    </HomeContainer>
  );
}
