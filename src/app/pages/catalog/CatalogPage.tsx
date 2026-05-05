import { useEffect, useMemo, useState } from 'react';
import { getCatalog } from '../../api/CardsService';
import { Card } from '../../interfaces/cards/Card';
import { Category } from '../../interfaces/Categoria';
import {
  PageWrapper,
  FilterBar,
  FilterChip,
  ResultMeta,
  ResultCount,
  CardsGrid,
  CardItem,
  CardNumber,
  CardDescription,
  CardMeta,
  CategoryBadge,
  PaginationRow,
  PaginationIconButton,
  PageButton,
  PageEllipsis,
  LoadingState,
  EmptyState,
} from './CatalogPage.styles';

const PAGE_SIZE = 8;
const CATEGORIES: Array<Category | 'TODAS'> = ['TODAS', 'COMUN', 'EPICO', 'LEGENDARIO'];

const CATEGORY_LABELS: Record<Category | 'TODAS', string> = {
  TODAS: 'Todas',
  COMUN: 'Común',
  EPICO: 'Épico',
  LEGENDARIO: 'Legendario',
};

const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function buildPageRange(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: Array<number | '...'> = [0];

  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total - 1);
  } else if (current >= total - 4) {
    pages.push('...', total - 5, total - 4, total - 3, total - 2, total - 1);
  } else {
    pages.push('...', current - 1, current, current + 1, '...', total - 1);
  }

  return pages;
}

export default function CatalogPage() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category | 'TODAS'>('TODAS');

  useEffect(() => {
    getCatalog().then((cards: Card[]) => {
      setAllCards(cards);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory === 'TODAS'
        ? allCards
        : allCards.filter((c) => c.category === activeCategory),
    [allCards, activeCategory],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageCards = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleCategoryChange = (cat: Category | 'TODAS') => {
    setActiveCategory(cat);
    setCurrentPage(0);
  };

  const pageRange = buildPageRange(safePage, totalPages);

  return (
    <PageWrapper>
      <FilterBar>
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat}
            $active={activeCategory === cat}
            onClick={() => handleCategoryChange(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </FilterChip>
        ))}
      </FilterBar>

      {loading ? (
        <LoadingState>Cargando catálogo…</LoadingState>
      ) : filtered.length === 0 ? (
        <EmptyState>No hay figuritas en esta categoría.</EmptyState>
      ) : (
        <>
          <ResultMeta>
            <ResultCount>
              {filtered.length} figurita{filtered.length !== 1 ? 's' : ''} · página{' '}
              {safePage + 1} de {totalPages}
            </ResultCount>
          </ResultMeta>

          <CardsGrid>
            {pageCards.map((card) => (
              <CardItem key={card.id}>
                <CardNumber>#{card.number}</CardNumber>
                <CardDescription>{card.description}</CardDescription>
                {(card.country || card.team) && (
                  <CardMeta>
                    {[card.country, card.team].filter(Boolean).join(' · ')}
                  </CardMeta>
                )}
                <CategoryBadge $category={card.category}>
                  {CATEGORY_LABELS[card.category]}
                </CategoryBadge>
              </CardItem>
            ))}
          </CardsGrid>

          {totalPages > 1 && (
            <PaginationRow>
              <PaginationIconButton
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Página anterior"
              >
                <IconChevronLeft />
              </PaginationIconButton>

              {pageRange.map((item, idx) =>
                item === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageButton
                    key={item}
                    $current={item === safePage}
                    data-current={item === safePage}
                    onClick={() => setCurrentPage(item as number)}
                    aria-label={`Ir a página ${(item as number) + 1}`}
                    aria-current={item === safePage ? 'page' : undefined}
                  >
                    {(item as number) + 1}
                  </PageButton>
                ),
              )}

              <PaginationIconButton
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                aria-label="Página siguiente"
              >
                <IconChevronRight />
              </PaginationIconButton>
            </PaginationRow>
          )}
        </>
      )}
    </PageWrapper>
  );
}
