import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import SearchFiguritas from '../../components/search/SearchFiguritas';
import SearchResults from '../../components/search/SearchResults';
import { Card } from '../../interfaces/cards/Card';

const SearchPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export default function SearchPage() {
  const [results, setResults] = useState<Card[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (
    figuritas: Card[],
    hasSearched: boolean,
    isLoading: boolean
  ) => {
    setResults(figuritas);
    setSearched(hasSearched);
    setLoading(isLoading);
  };

  return (
    <SearchPageContainer>
      <SearchFiguritas onSearch={handleSearch} />
      <SearchResults
        results={results}
        searched={searched}
        loading={loading}
      />
    </SearchPageContainer>
  );
}
