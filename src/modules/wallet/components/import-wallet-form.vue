<script setup lang="ts">
import BackButton from '@/common/components/back-button.vue'
import { ButtonAccent } from '@/common/ui'

import { useImportWallet } from '@/modules/wallet/composables/useImportWallet.ts'

import { MNEMONIC_LENGTH } from '@/modules/wallet/consts/mnemonic.ts'

const { words, error, allFilled, isImporting, importWallet, onPaste, onInput } = useImportWallet()
</script>

<template>
    <div class="mb-6 flex items-center">
        <BackButton />
        <h1 class="ml-2 text-xl font-bold">Импорт кошелька</h1>
    </div>

    <p class="mb-6 text-sm text-text-secondary">
        Введите {{ MNEMONIC_LENGTH }} слова вашей секретной фразы для восстановления кошелька.
    </p>

    <div class="mb-6 grid grid-cols-3 gap-2">
        <v-text-field
            v-for="(_, index) in words"
            :key="index"
            :model-value="words[index]"
            :label="`${index + 1}`"
            variant="underlined"
            density="compact"
            hide-details
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            @update:model-value="(v: string) => onInput(v, index)"
            @paste="(e: ClipboardEvent) => onPaste(e, index)"
        />
    </div>

    <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4 flex flex-0 gap-2 p-2 rounded-xl!"
        density="compact"
    >
        {{ error }}
    </v-alert>

    <div class="mt-auto">
        <ButtonAccent
            text="Импортировать"
            block
            :disabled="!allFilled"
            :loading="isImporting"
            @click="importWallet"
        />
    </div>
</template>
