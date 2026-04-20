<script setup lang="ts">
import TransactionItem from '@/modules/dashboard/components/transaction-item.vue'

import type { Transaction } from '@/modules/dashboard/models/types/transaction'

defineProps<{
    transactions: Transaction[]
    isLoading: boolean
    searchQuery: string
}>()

const emit = defineEmits<{
    'update:searchQuery': [value: string]
    copy: [address: string]
}>()
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-text-primary">История</h2>
            <span v-if="!isLoading && transactions.length > 0" class="text-sm text-text-muted">
                {{ transactions.length }}
            </span>
        </div>

        <v-text-field
            :model-value="searchQuery"
            placeholder="Поиск..."
            variant="underlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
            clearable
            @update:model-value="(v: string) => emit('update:searchQuery', v ?? '')"
            class="search-field"
        />

        <div v-if="isLoading" class="flex flex-col gap-2">
            <v-skeleton-loader
                v-for="i in 4"
                :key="i"
                type="list-item-avatar-two-line"
                class="skeleton-item"
            />
        </div>

        <div
            v-else-if="transactions.length === 0 && searchQuery.length > 0"
            class="py-8 text-center text-sm text-text-muted"
        >
            Ничего не найдено
        </div>

        <div v-else-if="transactions.length === 0" class="py-8 text-center text-sm text-text-muted">
            <p>Транзакций пока нет</p>
            <p class="mt-1 text-xs">Получите тестовые TON через @testgiver_ton_bot</p>
        </div>

        <div v-else class="flex flex-col gap-1">
            <TransactionItem
                v-for="tx in transactions"
                :key="tx.hash"
                :direction="tx.direction"
                :address="tx.address"
                :short-address="tx.shortAddress"
                :amount="tx.amount"
                :timestamp="tx.timestamp"
                :comment="tx.comment"
                :is-dust="tx.isDust"
                @copy="(addr) => emit('copy', addr)"
            />
        </div>
    </div>
</template>

<style scoped>
.search-field {
    flex: 0 0 auto;
}

.search-field :deep(.v-field__prepend-inner) {
    margin-inline-end: 8px;
}

.skeleton-item {
    background-color: transparent !important;
}

.skeleton-item :deep(*) {
    background-color: transparent !important;
}

.skeleton-item :deep(.v-skeleton-loader__avatar) {
    background-color: var(--color-bg-tertiary) !important;
}

.skeleton-item :deep(.v-skeleton-loader__text) {
    background-color: var(--color-bg-tertiary) !important;
}
</style>
