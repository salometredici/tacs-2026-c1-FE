import { Card } from "../cards/Card";

export interface SearchFiguritasResponse {
    content: Card[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}