<script setup lang="ts">
defineProps<{
    balance: string
    isLoading: boolean
    isError?: boolean
}>()
</script>

<template>
    <div class="flex flex-col items-center py-6">
        <v-skeleton-loader
            v-if="isLoading"
            type="heading"
            class="balance-skeleton w-48 h-[60px]!"
        />

        <div v-else-if="isError" class="flex items-center gap-2 text-error">
            <v-icon size="24">mdi-alert-circle-outline</v-icon>
            <span class="text-lg">Не удалось загрузить</span>
        </div>

        <div v-else class="flex items-center gap-2">
            <span class="text-6xl font-bold text-text-primary">{{ balance }}</span>
            <span class="text-2xl text-text-secondary">TON</span>
        </div>
    </div>
</template>

<style scoped>
.balance-skeleton {
    background-color: transparent !important;
}

.balance-skeleton :deep(.v-skeleton-loader__heading) {
    background-color: var(--color-bg-tertiary);
}
</style>
