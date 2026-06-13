import { Card as CatalogCard } from '../../../interfaces/cards/Card';
import {
  CatalogSection, SectionHeader, SectionIcon, SectionTitle, CatalogSectionSubtitle,
  SuggestionCard, CatalogPreviewThumbnail, CardNumber, CardPlayer,
  CatalogViewAllLink,
} from '../HomePage.styles';
import HorizontalCarousel from './HorizontalCarousel';

interface Props {
  catalogPreview: CatalogCard[];
  onViewAll: () => void;
}

export default function CatalogPreviewSection({ catalogPreview, onViewAll }: Props) {
  return (
    <CatalogSection>
      <SectionHeader>
        <SectionIcon>
          <span className="material-symbols-outlined" aria-hidden="true">view_list</span>
        </SectionIcon>
        <SectionTitle>Catálogo de Figuritas</SectionTitle>
      </SectionHeader>
      <CatalogSectionSubtitle>
        Explorá las figuritas del Mundial y filtrá por categoría
      </CatalogSectionSubtitle>
      <HorizontalCarousel autoScroll={false}>
        {catalogPreview.map(card => (
          <SuggestionCard key={card.id} onClick={onViewAll}>
            <CatalogPreviewThumbnail $category={card.category}>
              <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
            </CatalogPreviewThumbnail>
            <CardNumber>{card.id}</CardNumber>
            <CardPlayer>{card.description}</CardPlayer>
          </SuggestionCard>
        ))}
      </HorizontalCarousel>
      <CatalogViewAllLink onClick={onViewAll}>
        Ver todo el catálogo
        <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
      </CatalogViewAllLink>
    </CatalogSection>
  );
}
