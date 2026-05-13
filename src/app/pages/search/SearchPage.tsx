import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import SearchCards from '../../components/search/SearchCards';
import SearchResults from '../../components/search/SearchResults';
import { searchAvailable, SearchAvailableResponse } from '../../api/CardsService';
import { SearchFiguritasFilters } from '../../interfaces/search/SearchFiguritasFilters';

const SearchPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const PAGE_SIZE = 10;
const EMPTY_RESULTS: SearchAvailableResponse = {
  publications: { data: [], currentPage: 1, totalPages: 0 },
  auctions: { data: [], currentPage: 1, totalPages: 0 },
};

export default function SearchPage() {
  const [results, setResults] = useState<SearchAvailableResponse>(EMPTY_RESULTS);
  const [activeFilters, setActiveFilters] = useState<SearchFiguritasFilters | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const runSearch = async (
    filters: SearchFiguritasFilters,
    pubPage: number,
    aucPage: number,
  ) => {
    setLoading(true);
    const data = await searchAvailable({
      number: filters.number,
      description: filters.description,
      country: filters.country,
      category: filters.category,
      pubPage,
      pubPerPage: PAGE_SIZE,
      aucPage,
      aucPerPage: PAGE_SIZE,
    });
    setResults(data);
    setLoading(false);
  };

  const handleSearch = async (filters: SearchFiguritasFilters) => {
    setActiveFilters(filters);
    setSearched(true);
    await runSearch(filters, 1, 1);
  };

  const handleReset = () => {
    setActiveFilters(null);
    setResults(EMPTY_RESULTS);
    setSearched(false);
  };

  const handlePubPageChange = (page: number) => {
    if (!activeFilters) return;
    runSearch(activeFilters, page, results.auctions.currentPage);
  };

  const handleAucPageChange = (page: number) => {
    if (!activeFilters) return;
    runSearch(activeFilters, results.publications.currentPage, page);
  };

  return (
    <SearchPageContainer>
      <SearchCards onSearch={handleSearch} onReset={handleReset} loading={loading} />
      <SearchResults
        results={results}
        searched={searched}
        loading={loading}
        onPubPageChange={handlePubPageChange}
        onAucPageChange={handleAucPageChange}
      />
    </SearchPageContainer>
  );
}
