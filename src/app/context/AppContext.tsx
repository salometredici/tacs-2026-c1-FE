import { FC, ReactNode, createContext, useState } from "react";
import { AppContextType } from "./AppContextType";
import { defaultSearchFilters, SearchFiguritasFilters } from "../interfaces/search/SearchFiguritasFilters";
import { Figurita } from "../interfaces/Figurita";

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: FC<{children: ReactNode}> = ({ children }) => {
    const [filters, setFilters] = useState<SearchFiguritasFilters>(defaultSearchFilters);
    const [searchFiguritasResults, setSearchFiguritasResults] = useState<Figurita[]>([]);

    const contextValue = {
        filters, setFilters,
        searchFiguritasResults, setSearchFiguritasResults,
    };

    return (
        <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    );
};
