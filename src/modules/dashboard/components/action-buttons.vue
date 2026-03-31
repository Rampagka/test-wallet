<script setup lang="ts">
import { ButtonAccent, ButtonSecondary } from '@/common/ui'

const emit = defineEmits<{
    send: []
    receive: []
}>()
</script>

<template>
    <div class="flex w-full gap-3 px-4">
        <ButtonAccent
            text="Отправить"
            prepend-icon="mdi-arrow-up"
            class="flex-1"
            @click="emit('send')"
        />

        <ButtonSecondary
            text="Получить"
            prepend-icon="mdi-arrow-down"
            class="flex-1"
            @click="emit('receive')"
        />
    </div>
</template>
