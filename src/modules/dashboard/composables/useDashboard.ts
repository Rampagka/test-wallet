import { MIN_SEARCH_LENGTH } from '@/modules/dashboard/consts/dashboard'

import { useContactsStore } from '@/modules/contacts'
import { useDashboardStore } from '@/modules/dashboard/store/dashboard.store'
import { useWalletStore } from '@/modules/wallet'

import { computed, onMounted, ref, watch } from 'vue'

const MAX_RETRIES = 3
const RETRY_DELAY = 5_000

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useDashboard() {
    const walletStore = useWalletStore()
    const dashboardStore = useDashboardStore()
    const contactsStore = useContactsStore()

    const searchQuery = ref('')
    const isRefreshing = ref(false)

    async function loadBalance(address: string) {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const success = await dashboardStore.fetchBalance(address)
            if (success) return
            if (attempt < MAX_RETRIES - 1) await delay(RETRY_DELAY)
        }
    }

    function getKnownAddresses(): Set<string> {
        return new Set(contactsStore.contacts.map((c) => c.address))
    }

    async function loadTransactions(address: string) {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const success = await dashboardStore.fetchTransactions(address, getKnownAddresses())
            if (success) return
            if (attempt < MAX_RETRIES - 1) await delay(RETRY_DELAY)
        }
    }

    async function loadData() {
        const address = walletStore.address
        await Promise.all([loadBalance(address), loadTransactions(address)])
    }

    async function retry() {
        dashboardStore.resetState()
        await loadData()
    }

    async function refresh() {
        isRefreshing.value = true
        const address = walletStore.address
        await dashboardStore.fetchBalance(address)
        await dashboardStore.fetchTransactions(address, getKnownAddresses())
        isRefreshing.value = false
    }

    onMounted(() => {
        loadData()
    })

    // Reload data when active account changes
    watch(
        () => walletStore.address,
        (newAddress, oldAddress) => {
            if (newAddress && newAddress !== oldAddress) {
                dashboardStore.resetState()
                loadData()
            }
        },
    )

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
        isBalanceLoading: computed(
            () => !dashboardStore.balanceLoaded && !dashboardStore.balanceError,
        ),
        isBalanceError: computed(() => !!dashboardStore.balanceError),

        transactions: filteredTransactions,
        isTransactionsLoading: computed(
            () => !dashboardStore.transactionsLoaded && !dashboardStore.transactionsError,
        ),
        isTransactionsError: computed(() => !!dashboardStore.transactionsError),

        searchQuery,
        isRefreshing,
        refresh,
        retry,
    }
}
