<script setup lang="ts">
import BackButton from '@/common/components/back-button.vue'
import { ButtonAccent, ButtonSecondary } from '@/common/ui'

import { useCreateWallet } from '@/modules/wallet/composables/useCreateWallet.ts'

const { words, isLoading, isCopied, isSaving, copyMnemonic, confirmSaved } = useCreateWallet()
</script>

<template>
    <div class="mb-6 flex items-center">
        <BackButton />
        <h1 class="ml-2 text-xl font-bold">Новый кошелёк</h1>
    </div>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
        <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else>
        <v-alert
            type="warning"
            variant="tonal"
            class="mb-6 flex flex-0 gap-2 p-2 rounded-xl!"
            density="compact"
        >
            Запишите эту фразу и храните в безопасном месте. Она нужна для восстановления кошелька.
        </v-alert>

        <div class="mb-6 grid grid-cols-3 gap-2">
            <div
                v-for="(word, index) in words"
                :key="index"
                class="rounded-xl bg-bg-secondary px-3 py-2 text-sm"
            >
                <span class="mr-1 text-text-muted">{{ index + 1 }}.</span>
                <span class="text-text-primary">{{ word }}</span>
            </div>
        </div>

        <div class="mt-auto flex flex-col gap-3">
            <ButtonSecondary
                :text="isCopied ? 'Скопировано' : 'Скопировать'"
                block
                :prepend-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
                @click="copyMnemonic"
            />

            <ButtonAccent text="Я сохранил фразу" block :loading="isSaving" @click="confirmSaved" />
        </div>
    </template>
</template>
