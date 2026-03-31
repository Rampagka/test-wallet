import { formatTonAmount } from '@/common/helpers/format-ton'

import type { Transaction } from '@/modules/dashboard/models/types/transaction'

import { getBalance } from '@/modules/dashboard/services/balance.service'
import { getTransactions as fetchTransactionsFromApi } from '@/modules/dashboard/services/transaction.service'

import { fromNano } from '@ton/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
    const balanceNano = ref<bigint>(0n)
    const transactions = ref<Transaction[]>([])
    const balanceLoaded = ref(false)
    const transactionsLoaded = ref(false)

    const balanceFormatted = computed(() => formatTonAmount(fromNano(balanceNano.value)))

    async function fetchBalance(address: string): Promise<boolean> {
        try {
            balanceNano.value = await getBalance(address)
            balanceLoaded.value = true
            return true
        } catch {
            return false
        }
    }

    async function fetchTransactions(address: string, knownAddresses?: Set<string>): Promise<boolean> {
        try {
            transactions.value = await fetchTransactionsFromApi(address, knownAddresses)
            transactionsLoaded.value = true
            return true
        } catch {
            return false
        }
    }

    return {
        balanceNano,
        balanceFormatted,
        transactions,
        balanceLoaded,
        transactionsLoaded,
        fetchBalance,
        fetchTransactions,
    }
})
