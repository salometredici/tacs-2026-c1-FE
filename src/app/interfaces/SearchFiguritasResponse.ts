import { Figurita } from "./Figurita";

export interface SearchFiguritasResponse {
    figuritas: Figurita[];
    count: number;
}