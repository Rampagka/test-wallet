<script setup lang="ts">
import ActionButtons from '@/modules/dashboard/components/action-buttons.vue'
import AddressBar from '@/modules/dashboard/components/address-bar.vue'
import BalanceCard from '@/modules/dashboard/components/balance-card.vue'

defineProps<{
    shortAddress: string
    fullAddress: string
    balance: string
    isBalanceLoading: boolean
    isRefreshing: boolean
}>()

const emit = defineEmits<{
    copy: []
    send: []
    receive: []
    refresh: []
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-4 px-4 pb-4 pt-6 mb-4">
        <div class="flex items-center gap-2">
            <AddressBar :short-address="shortAddress" @copy="emit('copy')" />

            <button
                class="flex items-center justify-center rounded-full bg-bg-secondary p-2 transition-opacity hover:opacity-80"
                :class="{ 'animate-spin': isRefreshing }"
                :disabled="isRefreshing"
                @click="emit('refresh')"
            >
                <v-icon size="18" color="secondary">mdi-refresh</v-icon>
            </button>
        </div>

        <BalanceCard :balance="balance" :is-loading="isBalanceLoading" />

        <ActionButtons @send="emit('send')" @receive="emit('receive')" />
    </div>
</template>
