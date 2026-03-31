<script setup lang="ts">
import type { SendFormErrors } from '@/modules/send/models/types/send-form'

interface Props {
    address: string
    amount: string
    comment: string
    errors: SendFormErrors
    balance: string
    isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'update:address': [value: string]
    'update:amount': [value: string]
    'update:comment': [value: string]
    submit: []
    setMaxAmount: []
}>()
</script>

<template>
    <div class="flex flex-col gap-4">
        <!-- Баланс -->
        <v-alert type="info" variant="tonal" density="compact" class="flex flex-0 gap-2 p-2">
            <div class="flex items-center justify-between">
                <span class="text-sm">Доступно:</span>
                <span class="text-sm font-semibold">{{ balance }} TON</span>
            </div>
        </v-alert>

        <!-- Адрес получателя -->
        <v-text-field
            :model-value="address"
            label="Адрес получателя"
            placeholder="UQA..."
            variant="outlined"
            density="comfortable"
            :error-messages="errors.address"
            hide-details="auto"
            @update:model-value="(v: string) => emit('update:address', v)"
        />

        <!-- Сумма -->
        <div class="flex gap-2">
            <v-text-field
                :model-value="amount"
                label="Сумма"
                placeholder="0.00"
                variant="outlined"
                density="comfortable"
                type="number"
                suffix="TON"
                :error-messages="errors.amount"
                hide-details="auto"
                class="flex-1"
                @update:model-value="(v: string) => emit('update:amount', v)"
            />

            <v-btn
                variant="tonal"
                size="large"
                rounded="lg"
                class="max-btn h-[48px]!"
                @click="emit('setMaxAmount')"
            >
                Макс
            </v-btn>
        </div>

        <!-- Комментарий (опционально) -->
        <v-text-field
            :model-value="comment"
            label="Комментарий (необязательно)"
            placeholder="Для чего перевод..."
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="(v: string) => emit('update:comment', v)"
        />

        <!-- Кнопка отправки -->
        <v-btn
            color="primary"
            size="large"
            block
            rounded="lg"
            :loading="isLoading"
            :disabled="!address || !amount"
            class="mt-2"
            @click="emit('submit')"
        >
            Отправить
        </v-btn>
    </div>
</template>

<style scoped>
.max-btn {
    min-width: 80px;
}

.max-btn :deep(.v-btn__overlay) {
    display: none;
}

.max-btn:hover {
    opacity: 0.8;
}
</style>
