export interface SearchFiguritasFilters {
    numero: number;
    jugador: string;
    seleccion: string;
    equipo: string;
}

export const defaultSearchFilters: SearchFiguritasFilters = {
    numero: -1,
    jugador: '',
    seleccion: '',
    equipo: ''
}