import { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getUserSuggestions } from '../../api/UsersService';
import { getCatalog } from '../../api/CardsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useFetch } from '../../hooks/useFetch';
import {
  HomeContainer, Title, Subtitle,
  CardsGrid, Card, CardIcon, CardTitle, CardDescription,
} from './HomePage.styles';
import SuggestionsSection from './sections/SuggestionsSection';
import CatalogPreviewSection from './sections/CatalogPreviewSection';

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

  // El cron regenera, no hace falta optimistic-remove tras navegar a la sugerida
  const openSuggestion = (sourceType: 'PUBLICATION' | 'AUCTION', sourceId: string) => {
    const route = sourceType === 'PUBLICATION' ? '/publications' : '/auctions';
    navigate(`${route}/${sourceId}`);
  };

  return (
    <HomeContainer>
      <Title>¡Bienvenido, {currentUser.name}!</Title>
      <Subtitle>Intercambia figuritas con otros coleccionistas</Subtitle>

      <SuggestionsSection
        suggestions={suggestions}
        loading={loadingSuggestions}
        onItemClick={openSuggestion}
      />

      <CatalogPreviewSection
        catalogPreview={catalogPreview}
        onViewAll={() => navigate('/catalog')}
      />

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
