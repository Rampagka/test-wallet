<script setup lang="ts">
import { ButtonAccent, ButtonSecondary } from '@/common/ui'

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
        <p class="text-center text-base text-text-secondary">
            Баланс: <span class="font-semibold text-text-primary">{{ balance }} TON</span>
        </p>

        <!-- Адрес получателя -->
        <v-text-field
            :model-value="address"
            label="Адрес получателя"
            placeholder="UQA..."
            variant="underlined"
            density="comfortable"
            :error-messages="errors.address"
            hide-details="auto"
            @update:model-value="(v: string) => emit('update:address', v)"
        />

        <!-- Сумма -->
        <div class="flex items-center gap-2">
            <v-text-field
                :model-value="amount"
                label="Сумма"
                placeholder="0.00"
                variant="underlined"
                density="comfortable"
                type="number"
                suffix="TON"
                :error-messages="errors.amount"
                hide-details="auto"
                class="flex-1"
                @update:model-value="(v: string) => emit('update:amount', v)"
            />

            <ButtonSecondary
                text="Макс"
                class="h-[48px]! min-w-[80px]"
                @click="emit('setMaxAmount')"
            />
        </div>

        <!-- Комментарий (опционально) -->
        <v-text-field
            :model-value="comment"
            label="Комментарий (необязательно)"
            placeholder="Для чего перевод..."
            variant="underlined"
            density="comfortable"
            hide-details
            @update:model-value="(v: string) => emit('update:comment', v)"
        />

        <!-- Кнопка отправки -->
        <ButtonAccent
            text="Отправить"
            block
            :loading="isLoading"
            :disabled="!address || !amount"
            class="mt-2"
            @click="emit('submit')"
        />
    </div>
</template>
