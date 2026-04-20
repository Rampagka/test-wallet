import type { TransactionDirection } from '@/modules/dashboard/models/types/transaction-direction'

export interface Transaction {
    hash: string
    timestamp: number
    direction: TransactionDirection
    address: string
    shortAddress: string
    amount: string
    comment: string
    isDust: boolean
}
