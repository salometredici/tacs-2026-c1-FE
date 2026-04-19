export interface SearchFiguritasFilters {
    number: string;
    jugador: string;
    seleccion: string;
    equipo: string;
}

export const defaultSearchFilters: SearchFiguritasFilters = {
    number: '',
    jugador: '',
    seleccion: '',
    equipo: ''
}