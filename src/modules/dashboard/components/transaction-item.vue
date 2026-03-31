<script setup lang="ts">
import { formatTransactionTime } from '@/common/helpers/format-time'

import type { TransactionDirection } from '@/modules/dashboard/models/types/transaction-direction'

import { computed } from 'vue'

const props = defineProps<{
    direction: TransactionDirection
    shortAddress: string
    amount: string
    timestamp: number
    comment: string
    isDust: boolean
}>()

const isIncoming = computed(() => props.direction === 'in')

const formattedTime = computed(() => formatTransactionTime(props.timestamp))

const amountDisplay = computed(() => (isIncoming.value ? `+${props.amount}` : `-${props.amount}`))
</script>

<template>
    <div class="flex items-center gap-3 rounded-xl px-3 py-3" :class="isDust ? 'bg-warning/5' : ''">
        <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            :class="isIncoming ? 'bg-success/15' : 'bg-bg-tertiary'"
        >
            <v-icon
                :icon="isIncoming ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold'"
                :color="isIncoming ? 'success' : 'secondary'"
                size="20"
            />
        </div>

        <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1">
                <span class="truncate text-sm text-text-primary">
                    {{ shortAddress }}
                </span>
                <v-icon v-if="isDust" icon="mdi-alert-circle-outline" color="warning" size="14" />
            </div>
            <p v-if="comment" class="truncate text-xs text-text-muted">
                {{ comment }}
            </p>
        </div>

        <div class="shrink-0 text-right">
            <div
                class="text-sm font-medium"
                :class="isIncoming ? 'text-success' : 'text-text-primary'"
            >
                {{ amountDisplay }} TON
            </div>
            <div class="text-xs text-text-muted">{{ formattedTime }}</div>
        </div>
    </div>
</template>
