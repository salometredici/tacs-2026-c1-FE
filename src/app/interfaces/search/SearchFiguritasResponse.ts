import { Figurita } from "../figuritas/Figurita";

export interface SearchFiguritasResponse {
    content: Figurita[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}