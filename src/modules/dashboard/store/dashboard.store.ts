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
    const balanceError = ref<string | null>(null)
    const transactionsError = ref<string | null>(null)

    const balanceFormatted = computed(() => formatTonAmount(fromNano(balanceNano.value)))

    async function fetchBalance(address: string): Promise<boolean> {
        try {
            balanceNano.value = await getBalance(address)
            balanceLoaded.value = true
            balanceError.value = null
            return true
        } catch (e) {
            balanceError.value = e instanceof Error ? e.message : 'Ошибка загрузки баланса'
            return false
        }
    }

    async function fetchTransactions(address: string, knownAddresses?: Set<string>): Promise<boolean> {
        try {
            transactions.value = await fetchTransactionsFromApi(address, knownAddresses)
            transactionsLoaded.value = true
            transactionsError.value = null
            return true
        } catch (e) {
            transactionsError.value = e instanceof Error ? e.message : 'Ошибка загрузки транзакций'
            return false
        }
    }

    function resetState() {
        balanceNano.value = 0n
        transactions.value = []
        balanceLoaded.value = false
        transactionsLoaded.value = false
        balanceError.value = null
        transactionsError.value = null
    }

    return {
        balanceNano,
        balanceFormatted,
        transactions,
        balanceLoaded,
        transactionsLoaded,
        balanceError,
        transactionsError,
        fetchBalance,
        fetchTransactions,
        resetState,
    }
})
