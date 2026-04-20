<script setup lang="ts">
import ActionButtons from '@/modules/dashboard/components/action-buttons.vue'
import AddressBar from '@/modules/dashboard/components/address-bar.vue'
import BalanceCard from '@/modules/dashboard/components/balance-card.vue'

import type { WalletAccount } from '@/modules/wallet'

import { ref } from 'vue'

defineProps<{
    shortAddress: string
    fullAddress: string
    balance: string
    isBalanceLoading: boolean
    isBalanceError?: boolean
    isRefreshing: boolean
    accounts: WalletAccount[]
    activeAccountIndex: number
}>()

const emit = defineEmits<{
    copy: []
    send: []
    receive: []
    refresh: []
    'add-wallet': [mode: 'create' | 'import']
    'switch-account': [index: number]
}>()

const isAddMenuOpen = ref(false)
</script>

<template>
    <div class="flex flex-col items-center gap-4 px-4 pb-4 pt-6 mb-4">
        <div class="flex items-center gap-2">
            <!-- Add wallet button -->
            <v-menu v-model="isAddMenuOpen" location="bottom start">
                <template #activator="{ props }">
                    <button
                        v-bind="props"
                        class="flex items-center justify-center rounded-full bg-bg-secondary p-2 transition-opacity hover:opacity-80"
                    >
                        <v-icon size="18" color="secondary">mdi-plus</v-icon>
                    </button>
                </template>
                <v-list density="compact" class="rounded-xl! bg-bg-secondary!">
                    <v-list-item @click="emit('add-wallet', 'create')">
                        <template #prepend>
                            <v-icon size="20">mdi-wallet-plus-outline</v-icon>
                        </template>
                        <v-list-item-title class="text-sm">Создать кошелёк</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="emit('add-wallet', 'import')">
                        <template #prepend>
                            <v-icon size="20">mdi-import</v-icon>
                        </template>
                        <v-list-item-title class="text-sm">Импортировать</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <!-- Account switcher -->
            <v-menu v-if="accounts.length > 1" location="bottom start">
                <template #activator="{ props }">
                    <button
                        v-bind="props"
                        class="flex items-center justify-center rounded-full bg-bg-secondary p-2 transition-opacity hover:opacity-80"
                    >
                        <v-icon size="18" color="secondary">mdi-chevron-down</v-icon>
                    </button>
                </template>
                <v-list density="compact" class="rounded-xl! bg-bg-secondary!">
                    <v-list-item
                        v-for="(account, index) in accounts"
                        :key="account.address"
                        @click="emit('switch-account', index)"
                    >
                        <template #prepend>
                            <v-icon
                                size="18"
                                :color="index === activeAccountIndex ? 'accent' : 'transparent'"
                            >
                                mdi-check
                            </v-icon>
                        </template>
                        <v-list-item-title class="text-sm">
                            {{ account.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-xs text-text-secondary">
                            {{ account.address.slice(0, 6) }}...{{ account.address.slice(-4) }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-menu>

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

        <BalanceCard :balance="balance" :is-loading="isBalanceLoading" :is-error="isBalanceError" />

        <ActionButtons @send="emit('send')" @receive="emit('receive')" />
    </div>
</template>

<style scoped>
.v-list-item :deep(.v-list-item__overlay) {
    background: transparent !important;
}
</style>
