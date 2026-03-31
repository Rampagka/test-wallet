import { MIN_SEARCH_LENGTH } from '@/modules/dashboard/consts/dashboard'

import { useDashboardStore } from '@/modules/dashboard/store/dashboard.store'
import { useWalletStore } from '@/modules/wallet'

import { computed, onMounted, ref } from 'vue'

const RETRY_DELAY = 10_000

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useDashboard() {
    const walletStore = useWalletStore()
    const dashboardStore = useDashboardStore()

    const searchQuery = ref('')
    const isRefreshing = ref(false)

    async function loadBalance(address: string) {
        let success = false
        while (!success) {
            success = await dashboardStore.fetchBalance(address)
            if (!success) await delay(RETRY_DELAY)
        }
    }

    async function loadTransactions(address: string) {
        let success = false
        while (!success) {
            success = await dashboardStore.fetchTransactions(address)
            if (!success) await delay(RETRY_DELAY)
        }
    }

    async function loadData() {
        const address = walletStore.address
        await loadBalance(address)
        await loadTransactions(address)
    }

    async function refresh() {
        isRefreshing.value = true
        const address = walletStore.address
        await dashboardStore.fetchBalance(address)
        await dashboardStore.fetchTransactions(address)
        isRefreshing.value = false
    }

    onMounted(() => {
        loadData()
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
        isBalanceLoading: computed(() => !dashboardStore.balanceLoaded),

        transactions: filteredTransactions,
        isTransactionsLoading: computed(() => !dashboardStore.transactionsLoaded),

        searchQuery,
        isRefreshing,
        refresh,
    }
}
