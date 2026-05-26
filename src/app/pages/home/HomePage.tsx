import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getUserSuggestions } from '../../api/UsersService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { getCatalog } from '../../api/CardsService';
import { useFetch } from '../../hooks/useFetch';
import {
  HomeContainer,
  Title,
  Subtitle,
  CatalogSection,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  CatalogSectionSubtitle,
  CatalogPreviewThumbnail,
  CatalogViewAllLink,
  CardsGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  SuggestionsSection,
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
  const { currentUser } = useOutletContext<AuthedOutletContext>();

  const { data: suggestionsData, isLoading: loadingSuggestions } = useFetch(
    () => getUserSuggestions(currentUser.id),
    [currentUser.id],
  );
  const { data: catalogData } = useFetch(() => getCatalog(), []);

  const suggestions = useMemo(() => suggestionsData ?? [], [suggestionsData]);
  const catalogPreview = useMemo(() => (catalogData ?? []).slice(0, 12), [catalogData]);

  // Navega a la publication/auction sugerida — el cron regenera, no hace falta optimistic-remove
  const openSuggestion = (sourceType: 'PUBLICATION' | 'AUCTION', sourceId: string) => {
    if (isDragging.current) return;
    const route = sourceType === 'PUBLICATION' ? '/publications' : '/auctions';
    navigate(`${route}/${sourceId}`);
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const catalogCarouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

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

  const scrollCatalogCarousel = (dir: 'left' | 'right') => {
    catalogCarouselRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
  };

  return (
    <HomeContainer>
      <Title>¡Bienvenido, {currentUser.name}!</Title>
      <Subtitle>Intercambia figuritas con otros coleccionistas</Subtitle>

      <SuggestionsSection>
        <SectionHeader>
          <SectionIcon>
            <span className="material-symbols-outlined" aria-hidden="true">recommend</span>
          </SectionIcon>
          <SectionTitle>Sugerencias para vos</SectionTitle>
        </SectionHeader>

        {loadingSuggestions ? (
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
                <SuggestionCard
                  key={`${s.sourceType}-${s.sourceId}`}
                  onClick={() => openSuggestion(s.sourceType, s.sourceId)}
                >
                  <CategoryBadge $category={s.cardCategory}>
                    {s.cardCategory}
                  </CategoryBadge>
                  <CardNumber>#{s.cardNumber}</CardNumber>
                  <CardPlayer>{s.cardDescription}</CardPlayer>
                  <CardMeta>{s.cardCountry}</CardMeta>
                  <CardOwner>
                    {s.sourceType === 'AUCTION' ? 'Subastada por' : 'Ofrecida por'} {s.publisherName}
                  </CardOwner>
                </SuggestionCard>
              ))}
            </SuggestionsCarousel>
            <CarouselArrow $side="right" onClick={() => scrollCarousel('right')} aria-label="Siguiente">
              <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </CarouselArrow>
          </CarouselWrapper>
        )}
      </SuggestionsSection>

      <CatalogSection>
        <SectionHeader>
          <SectionIcon>
            <span className="material-symbols-outlined" aria-hidden="true">view_list</span>
          </SectionIcon>
          <SectionTitle>Catálogo de Figuritas</SectionTitle>
        </SectionHeader>
        <CatalogSectionSubtitle>
          Explorá las 500 figuritas del Mundial y filtrá por categoría
        </CatalogSectionSubtitle>
        <CarouselWrapper>
          <CarouselArrow $side="left" onClick={() => scrollCatalogCarousel('left')} aria-label="Anterior">
            <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
          </CarouselArrow>
          <SuggestionsCarousel ref={catalogCarouselRef}>
            {catalogPreview.map(card => (
              <SuggestionCard key={card.id} onClick={() => navigate('/catalog')}>
                <CatalogPreviewThumbnail $category={card.category}>
                  <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
                </CatalogPreviewThumbnail>
                <CardNumber>#{card.number}</CardNumber>
                <CardPlayer>{card.description}</CardPlayer>
              </SuggestionCard>
            ))}
          </SuggestionsCarousel>
          <CarouselArrow $side="right" onClick={() => scrollCatalogCarousel('right')} aria-label="Siguiente">
            <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </CarouselArrow>
        </CarouselWrapper>
        <CatalogViewAllLink onClick={() => navigate('/catalog')}>
          Ver todo el catálogo
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </CatalogViewAllLink>
      </CatalogSection>

      <CardsGrid>
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

    </HomeContainer>
  );
}
