import { Categoria } from './Categoria'

export interface Figurita {
    id: string
    number: number
    description: string // Puede ser el nombre del jugador, "Equipo Argentino", "Copa del Mundo", etc
    country: string // Selección a la que pertenece (un jugador o equipo a X país)
    team: string // Club al que pertenece el jugador en la actualidad (puede ser nulo, como la selección si es una figurita de Copa)
    category: Categoria
}