export interface SearchFiguritasFilters {
    numero: string;
    jugador: string;
    seleccion: string;
    equipo: string;
}

export const defaultSearchFilters: SearchFiguritasFilters = {
    numero: '',
    jugador: '',
    seleccion: '',
    equipo: ''
}