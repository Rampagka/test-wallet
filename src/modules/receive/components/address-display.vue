<script setup lang="ts">
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
            <div class="mb-4 rounded-lg px-3 py-3">
                <p class="break-all font-mono text-xl leading-relaxed text-on-surface">
                    {{ address }}
                </p>
            </div>

            <v-btn
                rounded="lg"
                block
                color="primary"
                prepend-icon="mdi-content-copy"
                class="gap-2"
                size="large"
                @click="emit('copy')"
            >
                {{ isCopied ? 'Скопировали!' : 'Копируйте адрес' }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>
