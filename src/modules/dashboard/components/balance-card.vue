<script setup lang="ts">
defineProps<{
    balance: string
    isLoading: boolean
    error: string | null
}>()
</script>

<template>
    <div class="flex flex-col items-center py-6">
        <v-skeleton-loader v-if="isLoading" type="heading" class="w-48 h-[60px]! bg-transparent" />

        <v-alert
            v-else-if="error"
            type="error"
            variant="tonal"
            density="compact"
            class="w-full flex flex-0 gap-2 p-2"
        >
            {{ error }}
        </v-alert>

        <div v-else class="flex items-center gap-2">
            <span class="text-6xl font-bold text-text-primary">{{ balance }}</span>
            <span class="text-2xl text-text-secondary">TON</span>
        </div>
    </div>
</template>
