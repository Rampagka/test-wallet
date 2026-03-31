<script setup lang="ts">
import { WalletActions } from '@/modules/wallet'

import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="flex min-h-dvh flex-col items-center justify-center px-4">
        <div class="mb-12 text-center">
            <v-icon size="64" color="primary" class="mb-6">mdi-wallet</v-icon>
            <h1 class="mb-3 text-3xl font-bold text-text-primary">TON Кошелёк</h1>
            <p class="text-text-secondary">Безопасный кошелёк для TON тестнета</p>
        </div>

        <WalletActions />
    </div>
</template>
