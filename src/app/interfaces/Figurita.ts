import { Categoria } from './Categoria'

export interface Figurita {
    id: number
    numero: number
    jugador: string
    seleccion: string
    equipo: string
    categoria: Categoria
}