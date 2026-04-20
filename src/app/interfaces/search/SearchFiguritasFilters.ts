export interface SearchFiguritasFilters {
    number?: number;
    description?: string;
    country?: string;
    category?: string;
    type?: string;
}

export const defaultSearchFilters: SearchFiguritasFilters = {
    number: undefined,
    description: '',
    country: '',
    category: '',
    type: ''
}