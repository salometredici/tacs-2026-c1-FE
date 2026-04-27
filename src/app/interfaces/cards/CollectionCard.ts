export interface CollectionCard {
    cardId: string
    number: number
    description: string
    country: string | null
    team: string | null
    category: string
    quantity: number
    compromisedCount: number
    adquisitionDate?: string
    adquisitionOrigin?: string
}
