<script setup lang="ts">
import { useCreateWallet } from '@/modules/wallet/composables/useCreateWallet.ts'

import { useRouter } from 'vue-router'

const { words, isLoading, isCopied, isSaving, copyMnemonic, confirmSaved } = useCreateWallet()
const router = useRouter()
</script>

<template>
    <div class="mb-6 flex items-center">
        <v-btn icon variant="text" size="small" class="back-btn" @click="router.push('/')">
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="ml-2 text-xl font-bold">Новый кошелёк</h1>
    </div>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
        <v-alert
            type="warning"
            variant="tonal"
            class="mb-6 flex flex-0 gap-2 p-2"
            density="compact"
        >
            Запишите эту фразу и храните в безопасном месте. Она нужна для восстановления кошелька.
        </v-alert>

        <div class="mb-6 grid grid-cols-3 gap-2">
            <div
                v-for="(word, index) in words"
                :key="index"
                class="rounded-lg bg-bg-secondary px-3 py-2 text-sm"
            >
                <span class="mr-1 text-text-muted">{{ index + 1 }}.</span>
                <span class="text-text-primary">{{ word }}</span>
            </div>
        </div>

        <div class="mt-auto flex flex-col gap-3">
            <v-btn
                variant="tonal"
                size="large"
                block
                rounded="lg"
                :prepend-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
                @click="copyMnemonic"
                class="copy-btn gap-2"
            >
                {{ isCopied ? 'Скопировано' : 'Скопировать' }}
            </v-btn>

            <v-btn
                color="primary"
                size="large"
                block
                rounded="lg"
                :loading="isSaving"
                @click="confirmSaved"
            >
                Я сохранил фразу
            </v-btn>
        </div>
    </template>
</template>

<style scoped>
.back-btn :deep(.v-btn__overlay) {
    display: none;
}

.back-btn:hover {
    opacity: 0.8;
}

.copy-btn:hover :deep(.v-btn__overlay) {
    opacity: 0.06 !important;
}
</style>
