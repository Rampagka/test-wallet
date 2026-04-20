<script setup lang="ts">
import { useClipboard } from '@/common/composables/useClipboard'

import { DashboardHeader, TransactionList, useDashboard } from '@/modules/dashboard'
import { useWalletStore } from '@/modules/wallet'

import { useRouter } from 'vue-router'

const router = useRouter()
const walletStore = useWalletStore()
const { isCopied, copy } = useClipboard()

const {
    address,
    shortAddress,
    balanceFormatted,
    isBalanceLoading,
    isBalanceError,
    transactions,
    isTransactionsLoading,
    isTransactionsError,
    searchQuery,
    isRefreshing,
    refresh,
    retry,
} = useDashboard()

function onCopy(addr?: string) {
    copy(addr ?? address.value)
}

function onAddWallet(mode: 'create' | 'import') {
    router.push({ path: `/${mode}`, query: { addAccount: 'true' } })
}

function onSwitchAccount(index: number) {
    walletStore.switchAccount(index)
}
</script>

<template>
    <div class="flex flex-col pb-2">
        <DashboardHeader
            :short-address="shortAddress"
            :full-address="address"
            :balance="balanceFormatted"
            :is-balance-loading="isBalanceLoading"
            :is-balance-error="isBalanceError"
            :is-refreshing="isRefreshing"
            :accounts="walletStore.accounts"
            :active-account-index="walletStore.activeIndex"
            @copy="onCopy"
            @send="router.push('/send')"
            @receive="router.push('/receive')"
            @refresh="refresh"
            @add-wallet="onAddWallet"
            @switch-account="onSwitchAccount"
        />

        <TransactionList
            :transactions="transactions"
            :is-loading="isTransactionsLoading"
            :is-error="isTransactionsError"
            v-model:search-query="searchQuery"
            class="flex-1 px-4"
            @copy="(addr) => onCopy(addr)"
            @retry="retry"
        />

        <v-snackbar v-model="isCopied" :timeout="2000" color="success" class="copy-snackbar">
            Адрес скопирован
        </v-snackbar>
    </div>
</template>

<style></style>
