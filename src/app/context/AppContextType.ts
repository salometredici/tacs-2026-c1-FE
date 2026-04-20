import { Figurita } from "../interfaces/figuritas/Figurita";
import { SearchFiguritasFilters } from "../interfaces/search/SearchFiguritasFilters";

export type AppContextType = {
    filters: SearchFiguritasFilters;
    setFilters: (filters: SearchFiguritasFilters) => void;
    searchFiguritasResults: Figurita[];
    setSearchFiguritasResults: (results: Figurita[]) => void;
}
