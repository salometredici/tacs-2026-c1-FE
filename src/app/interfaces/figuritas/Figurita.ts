import { Categoria } from '../Categoria'

// figurita como viene del catalogo, no en las views del usuario o las paginas, seria lo mas basico en lo que se basan los demas
export interface Figurita {
    id: string
    number: number
    description: string // Puede ser el nombre del jugador, "Equipo Argentino", "Copa del Mundo", etc
    country: string // Selección a la que pertenece (un jugador o equipo a X país)
    team: string // club al que pertenece el jugador en la actualidad (puede ser nulo, como la selección si es una figurita de Copa)
    category: Categoria
}