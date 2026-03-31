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
    const isBalanceLoading = ref(true)
    const isTransactionsLoading = ref(true)
    const balanceError = ref<string | null>(null)
    const transactionsError = ref<string | null>(null)

    const balanceFormatted = computed(() => formatTonAmount(fromNano(balanceNano.value)))

    async function fetchBalance(address: string) {
        try {
            balanceNano.value = await getBalance(address)
            balanceError.value = null
        } catch (e) {
            balanceError.value = e instanceof Error ? e.message : 'Ошибка загрузки баланса'
        } finally {
            isBalanceLoading.value = false
        }
    }

    async function fetchTransactions(address: string, knownAddresses?: Set<string>) {
        try {
            transactions.value = await fetchTransactionsFromApi(address, knownAddresses)
            transactionsError.value = null
        } catch (e) {
            transactionsError.value = e instanceof Error ? e.message : 'Ошибка загрузки транзакций'
        } finally {
            isTransactionsLoading.value = false
        }
    }

    return {
        balanceNano,
        balanceFormatted,
        transactions,
        isBalanceLoading,
        isTransactionsLoading,
        balanceError,
        transactionsError,
        fetchBalance,
        fetchTransactions,
    }
})
