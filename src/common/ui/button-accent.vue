<script setup lang="ts">
defineProps<{
    text: string
    outlined?: boolean
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
        :variant="outlined ? 'outlined' : 'flat'"
        size="large"
        rounded="xl"
        :block="block"
        :disabled="disabled"
        :loading="loading"
        :prepend-icon="prependIcon"
        class="button-accent"
        :class="{ 'button-accent--outlined': outlined }"
        @click="emit('click')"
    >
        {{ text }}
    </v-btn>
</template>

<style scoped>
.button-accent {
    background-color: var(--color-accent);
    color: #fff;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
}

.button-accent :deep(.v-btn__overlay) {
    display: none;
}

.button-accent:hover {
    background-color: var(--color-accent-hover);
}

.button-accent--outlined {
    background-color: transparent;
    border: 1.5px solid var(--color-accent);
    color: #fff;
}

.button-accent--outlined:hover {
    background-color: var(--color-accent);
    color: #fff;
}
</style>
