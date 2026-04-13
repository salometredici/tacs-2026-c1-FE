import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { SearchFiguritasFilters } from "../interfaces/SearchFiguritasFilters";
import { SearchFiguritasResponse } from "../interfaces/SearchFiguritasResponse";

export const searchFiguritas = async (filters: SearchFiguritasFilters): Promise<SearchFiguritasResponse> => {
    try {
        const params = {
            numero: filters.numero,
            jugador: filters.jugador,
            seleccion: filters.seleccion,
            equipo: filters.equipo
        } as SearchFiguritasFilters;

        const result = await axios.get<SearchFiguritasResponse>(`${API_CONFIG.figuritas.search}`, { params });
        return result.data;
    } catch (error) {
        console.error(`Error en la búsqueda de figuritas:`, error);
        return { figuritas: [], count: 0 } as SearchFiguritasResponse;
    }
};
