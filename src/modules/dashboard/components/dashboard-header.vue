<script setup lang="ts">
import ActionButtons from '@/modules/dashboard/components/action-buttons.vue'
import AddressBar from '@/modules/dashboard/components/address-bar.vue'
import BalanceCard from '@/modules/dashboard/components/balance-card.vue'

defineProps<{
    shortAddress: string
    fullAddress: string
    balance: string
    isBalanceLoading: boolean
    balanceError: string | null
}>()

const emit = defineEmits<{
    copy: []
    send: []
    receive: []
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-4 px-4 pb-4 pt-6 mb-4">
        <AddressBar :short-address="shortAddress" @copy="emit('copy')" />

        <BalanceCard :balance="balance" :is-loading="isBalanceLoading" :error="balanceError" />

        <ActionButtons @send="emit('send')" @receive="emit('receive')" />
    </div>
</template>
