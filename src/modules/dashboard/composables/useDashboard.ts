import { computed, ref } from 'vue'

import { usePolling } from '@/common/composables/usePolling'

import { useWalletStore } from '@/modules/wallet'

import {
    BALANCE_POLLING_INTERVAL,
    MIN_SEARCH_LENGTH,
    TRANSACTION_POLLING_INTERVAL,
} from '@/modules/dashboard/consts/dashboard'
import { useDashboardStore } from '@/modules/dashboard/store/dashboard.store'

export function useDashboard() {
    const walletStore = useWalletStore()
    const dashboardStore = useDashboardStore()

    const searchQuery = ref('')

    const { isLoading: isBalanceLoading } = usePolling({
        fn: () => dashboardStore.fetchBalance(walletStore.address),
        interval: BALANCE_POLLING_INTERVAL,
    })

    const { isLoading: isTransactionsLoading } = usePolling({
        fn: () => dashboardStore.fetchTransactions(walletStore.address),
        interval: TRANSACTION_POLLING_INTERVAL,
    })

    const filteredTransactions = computed(() => {
        const query = searchQuery.value.trim().toLowerCase()
        if (query.length < MIN_SEARCH_LENGTH) {
            return dashboardStore.transactions
        }
        return dashboardStore.transactions.filter(
            (tx) =>
                tx.address.toLowerCase().includes(query) ||
                tx.comment.toLowerCase().includes(query) ||
                tx.amount.startsWith(query),
        )
    })

    return {
        address: computed(() => walletStore.address),
        shortAddress: computed(() => walletStore.shortAddress),

        balanceFormatted: computed(() => dashboardStore.balanceFormatted),
        isBalanceLoading,
        balanceError: computed(() => dashboardStore.balanceError),

        transactions: filteredTransactions,
        isTransactionsLoading,
        transactionsError: computed(() => dashboardStore.transactionsError),

        searchQuery,
    }
}
