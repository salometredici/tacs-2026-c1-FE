import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { SearchFiguritasFilters } from "../interfaces/search/SearchFiguritasFilters";
import { SearchFiguritasResponse } from "../interfaces/search/SearchFiguritasResponse";
import { mockSearchFiguritas } from "../../mocks/figuritasMock";

export const searchFiguritas = async (filters: SearchFiguritasFilters): Promise<SearchFiguritasResponse> => {
    try {
        const params = {
            numero: filters.numero,
            jugador: filters.jugador,
            seleccion: filters.seleccion,
            equipo: filters.equipo
        } as SearchFiguritasFilters;

        /* Ésta es la llamada al backend, pero por esta entrega, usamos mocks
        const result = await axios.get<SearchFiguritasResponse>(`${API_CONFIG.figuritas.search}`, { params });
        return result.data; */
        return mockSearchFiguritas();
    } catch (error) {
        console.error(`Error en la búsqueda de figuritas:`, error);
        return { figuritas: [], count: 0 } as SearchFiguritasResponse;
    }
};
