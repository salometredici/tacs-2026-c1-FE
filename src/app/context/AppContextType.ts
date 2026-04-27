import { Card } from "../interfaces/cards/Card";
import { SearchFiguritasFilters } from "../interfaces/search/SearchFiguritasFilters";

export type AppContextType = {
    filters: SearchFiguritasFilters;
    setFilters: (filters: SearchFiguritasFilters) => void;
    searchFiguritasResults: Card[];
    setSearchFiguritasResults: (results: Card[]) => void;
}
