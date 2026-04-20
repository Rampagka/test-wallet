<script setup lang="ts">
import { formatTransactionTime } from '@/common/helpers/format-time'

import type { TransactionDirection } from '@/modules/dashboard/models/types/transaction-direction'

import { computed } from 'vue'

const props = defineProps<{
    direction: TransactionDirection
    address: string
    shortAddress: string
    amount: string
    timestamp: number
    comment: string
    isDust: boolean
}>()

const isIncoming = computed(() => props.direction === 'in')

const formattedTime = computed(() => formatTransactionTime(props.timestamp))

const amountDisplay = computed(() => (isIncoming.value ? `+${props.amount}` : `-${props.amount}`))

const emit = defineEmits<{
    copy: [address: string]
}>()
</script>

<template>
    <div
        class="flex items-center gap-3 rounded-xl px-3 py-3"
        :class="isDust ? 'bg-warning/10 opacity-60' : ''"
    >
        <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            :class="isDust ? 'bg-warning/20' : isIncoming ? 'bg-success/15' : 'bg-bg-tertiary'"
        >
            <v-icon
                :icon="
                    isDust
                        ? 'mdi-alert-outline'
                        : isIncoming
                          ? 'mdi-arrow-down-bold'
                          : 'mdi-arrow-up-bold'
                "
                :color="isDust ? 'warning' : isIncoming ? 'success' : 'secondary'"
                size="20"
            />
        </div>

        <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1">
                <span class="truncate text-sm text-text-primary mr-1">
                    {{ shortAddress }}
                </span>
                <button
                    v-if="!isDust"
                    v-bind="props"
                    class="flex items-center justify-center rounded-full bg-bg-secondary p-1 transition-opacity hover:opacity-80"
                    @click="emit('copy', props.address)"
                >
                    <v-icon size="12" color="secondary">mdi-content-copy</v-icon>
                </button>
            </div>
            <p v-if="isDust" class="text-xs font-medium text-warning">Подозрительная</p>
            <p v-else-if="comment" class="truncate text-xs text-text-muted">
                {{ comment }}
            </p>
        </div>

        <div class="shrink-0 text-right">
            <div
                class="text-sm font-medium"
                :class="isDust ? 'text-warning' : isIncoming ? 'text-success' : 'text-text-primary'"
            >
                {{ amountDisplay }} TON
            </div>
            <div class="text-xs text-text-muted">{{ formattedTime }}</div>
        </div>
    </div>
</template>
