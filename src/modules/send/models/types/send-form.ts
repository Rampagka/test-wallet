export interface SendFormData {
    address: string
    amount: string
    comment: string
}

export interface SendFormErrors {
    address?: string
    amount?: string
}
