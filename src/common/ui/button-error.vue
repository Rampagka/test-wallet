<script setup lang="ts">
defineProps<{
    text: string
    outlined?: boolean
    block?: boolean
    disabled?: boolean
    loading?: boolean
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
        class="button-error"
        :class="{ 'button-error--outlined': outlined }"
        @click="emit('click')"
    >
        {{ text }}
    </v-btn>
</template>

<style scoped>
.button-error {
    background-color: var(--color-error);
    color: #fff;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 600;
}

.button-error :deep(.v-btn__overlay) {
    display: none;
}

.button-error:hover {
    opacity: 0.85;
}

.button-error--outlined {
    background-color: transparent;
    border: 1.5px solid var(--color-error);
    color: var(--color-error);
}

.button-error--outlined:hover {
    background-color: var(--color-error);
    color: #fff;
}
</style>
