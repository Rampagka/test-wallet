<script setup lang="ts">
defineProps<{
    text: string
    block?: boolean
    disabled?: boolean
    loading?: boolean
    prependIcon?: string
}>()

const emit = defineEmits<{
    click: []
}>()
</script>

<template>
    <v-btn
        variant="tonal"
        size="large"
        rounded="xl"
        :block="block"
        :disabled="disabled"
        :loading="loading"
        :prepend-icon="prependIcon"
        class="button-secondary"
        @click="emit('click')"
    >
        {{ text }}
    </v-btn>
</template>

<style scoped>
.button-secondary {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
}

.button-secondary :deep(.v-btn__overlay) {
    display: none;
}

.button-secondary:hover {
    opacity: 0.85;
}
</style>
