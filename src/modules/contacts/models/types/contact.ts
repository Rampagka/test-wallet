export interface Contact {
    id: string // UUID для уникальности
    name: string // Имя контакта
    address: string // TON адрес (non-bounceable, testOnly)
    addedAt: number // timestamp создания
}
