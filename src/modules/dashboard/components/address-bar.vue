<script setup lang="ts">
defineProps<{
    shortAddress: string
}>()

const emit = defineEmits<{
    copy: []
}>()
</script>

<template>
    <button
        class="flex items-center gap-2 rounded-full bg-bg-secondary px-4 py-2 transition-opacity hover:opacity-80"
        @click="emit('copy')"
    >
        <v-icon size="16" color="secondary">mdi-wallet-outline</v-icon>
        <span class="text-sm text-text-secondary">{{ shortAddress }}</span>
        <v-icon size="14" color="secondary">mdi-content-copy</v-icon>
    </button>
</template>
