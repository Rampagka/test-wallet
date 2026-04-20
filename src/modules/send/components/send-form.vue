<script setup lang="ts">
import { ButtonAccent, ButtonSecondary } from '@/common/ui'

import type { SendFormErrors } from '@/modules/send/models/types/send-form'

import type { Contact } from '@/modules/contacts'

interface Props {
    address: string
    amount: string
    comment: string
    errors: SendFormErrors
    balance: string
    isLoading: boolean
    contacts: Contact[]
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
        <p class="flex justify-between text-base mb-4">
            Баланс: <span class="font-semibold text-text-primary">{{ balance }} TON</span>
        </p>

        <!-- Адрес получателя -->
        <div class="flex items-center gap-2">
            <v-text-field
                :model-value="address"
                label="Адрес получателя"
                placeholder="UQA..."
                variant="underlined"
                density="default"
                :error-messages="errors.address"
                hide-details="auto"
                class="flex-1"
                @update:model-value="(v: string) => emit('update:address', v)"
            />

            <v-menu v-if="contacts.length > 0" location="bottom end">
                <template #activator="{ props }">
                    <button
                        v-bind="props"
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-secondary transition-opacity hover:opacity-80"
                    >
                        <v-icon size="20" color="secondary">mdi-account-box-outline</v-icon>
                    </button>
                </template>
                <v-list
                    density="compact"
                    class="rounded-xl! bg-bg-secondary! max-h-64 overflow-y-auto"
                >
                    <v-list-item
                        v-for="contact in contacts"
                        :key="contact.id"
                        @click="emit('update:address', contact.address)"
                    >
                        <template #prepend>
                            <v-icon size="20" color="secondary">mdi-account</v-icon>
                        </template>
                        <v-list-item-title class="text-sm">{{ contact.name }}</v-list-item-title>
                        <v-list-item-subtitle class="text-xs text-text-muted">
                            {{ contact.address.slice(0, 6) }}...{{ contact.address.slice(-4) }}
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <!-- Сумма -->
        <div class="flex items-center gap-2">
            <v-text-field
                :model-value="amount"
                label="Сумма"
                placeholder="0.00"
                variant="underlined"
                density="default"
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
            density="default"
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

<style scoped>
/* Compact list-item layout in contacts dropdown */
:deep(.v-list-item) {
    padding-inline: 12px !important;
    min-height: 40px !important;
}
:deep(.v-list-item__prepend) {
    min-width: 0 !important;
    width: auto !important;
    margin-inline-end: 10px !important;
}
</style>
