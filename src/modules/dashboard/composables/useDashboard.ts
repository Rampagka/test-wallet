import { MIN_SEARCH_LENGTH } from '@/modules/dashboard/consts/dashboard'

import { useContactsStore } from '@/modules/contacts'
import { useDashboardStore } from '@/modules/dashboard/store/dashboard.store'
import { useWalletStore } from '@/modules/wallet'

import { computed, onMounted, ref, watch } from 'vue'

const RETRY_DELAY = 10_000

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
        let success = false
        while (!success) {
            success = await dashboardStore.fetchBalance(address)
            if (!success) await delay(RETRY_DELAY)
        }
    }

    function getKnownAddresses(): Set<string> {
        return new Set(contactsStore.contacts.map((c) => c.address))
    }

    async function loadTransactions(address: string) {
        let success = false
        while (!success) {
            success = await dashboardStore.fetchTransactions(address, getKnownAddresses())
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
        isBalanceLoading: computed(() => !dashboardStore.balanceLoaded),

        transactions: filteredTransactions,
        isTransactionsLoading: computed(() => !dashboardStore.transactionsLoaded),

        searchQuery,
        isRefreshing,
        refresh,
    }
}
