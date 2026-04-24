import { Category } from '../Categoria'

export interface Figurita {
    id: string
    number: number
    description: string
    country: string
    team: string
    category: Category
}