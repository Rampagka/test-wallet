<script setup lang="ts">
import { useClipboard } from '@/common/composables/useClipboard'

import { DashboardHeader, TransactionList, useDashboard } from '@/modules/dashboard'

import { useRouter } from 'vue-router'

const router = useRouter()
const { isCopied, copy } = useClipboard()

const {
    address,
    shortAddress,
    balanceFormatted,
    isBalanceLoading,
    balanceError,
    transactions,
    isTransactionsLoading,
    transactionsError,
    searchQuery,
} = useDashboard()

function onCopy() {
    copy(address.value)
}
</script>

<template>
    <div class="flex min-h-dvh flex-col pb-20">
        <DashboardHeader
            :short-address="shortAddress"
            :full-address="address"
            :balance="balanceFormatted"
            :is-balance-loading="isBalanceLoading"
            :balance-error="balanceError"
            @copy="onCopy"
            @send="router.push('/send')"
            @receive="router.push('/receive')"
        />

        <TransactionList
            :transactions="transactions"
            :is-loading="isTransactionsLoading"
            :error="transactionsError"
            v-model:search-query="searchQuery"
            class="flex-1 px-4"
        />

        <v-snackbar v-model="isCopied" :timeout="2000" color="success" class="copy-snackbar">
            Адрес скопирован
        </v-snackbar>
    </div>
</template>

<style>
.copy-snackbar {
    padding-bottom: 20px;
}

.copy-snackbar .v-snackbar__wrapper {
    border-radius: 12px;
    padding: 12px 20px;
    min-width: auto;
}

.copy-snackbar .v-snackbar__content {
    padding: 0;
    text-align: center;
}
</style>
