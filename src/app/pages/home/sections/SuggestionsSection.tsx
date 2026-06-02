import { useRef } from 'react';
import { SuggestionResult } from '../../../interfaces/suggestions/SuggestionResult';
import {
  SuggestionsSection as Section, SectionHeader, SectionIcon, SectionTitle,
  SuggestionCard, CategoryBadge, CardNumber, CardPlayer, CardMeta, CardOwner,
  EmptyMessage,
} from '../HomePage.styles';
import HorizontalCarousel from './HorizontalCarousel';

interface Props {
  suggestions: SuggestionResult[];
  loading: boolean;
  onItemClick: (sourceType: 'PUBLICATION' | 'AUCTION', sourceId: string) => void;
}

export default function SuggestionsSection({ suggestions, loading, onItemClick }: Props) {
  const isDraggingRef = useRef(false);

  return (
    <Section>
      <SectionHeader>
        <SectionIcon>
          <span className="material-symbols-outlined" aria-hidden="true">recommend</span>
        </SectionIcon>
        <SectionTitle>Sugerencias para vos</SectionTitle>
      </SectionHeader>

      {loading ? (
        <EmptyMessage>Cargando sugerencias...</EmptyMessage>
      ) : suggestions.length === 0 ? (
        <EmptyMessage>No hay sugerencias disponibles por ahora.</EmptyMessage>
      ) : (
        <HorizontalCarousel isDraggingRef={isDraggingRef}>
          {suggestions.map(s => (
            <SuggestionCard
              key={`${s.sourceType}-${s.sourceId}`}
              onClick={() => {
                if (isDraggingRef.current) return;
                onItemClick(s.sourceType, s.sourceId);
              }}
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
        </HorizontalCarousel>
      )}
    </Section>
  );
}
