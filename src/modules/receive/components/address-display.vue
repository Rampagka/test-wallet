<script setup lang="ts">
import { ButtonAccent } from '@/common/ui'

interface Props {
    address: string
    isCopied: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    copy: []
}>()
</script>

<template>
    <v-card class="p-4 rounded-xl">
        <v-card-title class="text-center text-subtitle-1 mb-4">Ваш адрес</v-card-title>

        <v-card-text>
            <div class="mb-4 rounded-xl px-3 py-3">
                <p class="break-all font-mono text-xl leading-relaxed text-on-surface">
                    {{ address }}
                </p>
            </div>

            <ButtonAccent
                :text="isCopied ? 'Скопировали!' : 'Копируйте адрес'"
                block
                prepend-icon="mdi-content-copy"
                @click="emit('copy')"
            />
        </v-card-text>
    </v-card>
</template>
