<script setup lang="ts">
const emit = defineEmits<{
    send: []
    receive: []
}>()
</script>

<template>
    <div class="flex w-full gap-3 px-4">
        <v-btn
            color="primary"
            size="large"
            rounded="lg"
            class="flex-1 gap-2"
            prepend-icon="mdi-arrow-up"
            @click="emit('send')"
        >
            Отправить
        </v-btn>

        <v-btn
            variant="tonal"
            size="large"
            rounded="lg"
            class="receive-btn flex-1 gap-2"
            prepend-icon="mdi-arrow-down"
            @click="emit('receive')"
        >
            Получить
        </v-btn>
    </div>
</template>

<style scoped>
.receive-btn :deep(.v-btn__overlay) {
    display: none;
}

.receive-btn:hover {
    opacity: 0.8;
}
</style>
