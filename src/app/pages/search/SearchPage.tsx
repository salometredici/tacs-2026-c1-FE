import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import SearchCards from '../../components/search/SearchCards';
import SearchResults from '../../components/search/SearchResults';
import { Publication } from '../../interfaces/publications/Publication';

const SearchPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export default function SearchPage() {
  const [results, setResults] = useState<Publication[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (
    publications: Publication[],
    hasSearched: boolean,
    isLoading: boolean
  ) => {
    setResults(publications);
    setSearched(hasSearched);
    setLoading(isLoading);
  };

  return (
    <SearchPageContainer>
      <SearchCards onSearch={handleSearch} />
      <SearchResults
        results={results}
        searched={searched}
        loading={loading}
      />
    </SearchPageContainer>
  );
}
