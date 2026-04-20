<script setup lang="ts">
import { ButtonAccent, ButtonError } from '@/common/ui'

import { WARNING_MESSAGES, WARNING_TITLES } from '@/modules/send/consts/warnings'
import type { WarningType } from '@/modules/send/models/types/warning-type'

interface Props {
    isOpen: boolean
    to: string
    amount: string
    comment?: string
    fee: string
    warnings?: WarningType[]
}

const props = defineProps<Props>()

const CONFIRMATION_WARNINGS: WarningType[] = ['NEW_ADDRESS', 'BOUNCEABLE_ADDRESS', 'OWN_ADDRESS', 'ENTIRE_BALANCE']

const activeAlerts = () =>
    (props.warnings ?? []).filter((w) => CONFIRMATION_WARNINGS.includes(w))

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()
</script>

<template>
    <v-dialog
        :model-value="isOpen"
        max-width="500"
        @update:model-value="(v) => !v && emit('cancel')"
        content-class="dialog-bottom"
        scrim="black"
    >
        <v-card class="dialog-card">
            <div class="flex justify-between items-center py-4 px-6 text-center text-xl font-bold">
                <h4>Подтверждение отправки</h4>

                <v-btn
                    icon
                    variant="text"
                    size="large"
                    class="close-btn p-0 max-w-6! max-h-6"
                    @click="emit('cancel')"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>

            <v-card-text class="px-6 py-4">
                <div v-if="activeAlerts().length > 0" class="flex flex-col gap-2 mb-4">
                    <v-alert
                        v-for="w in activeAlerts()"
                        :key="w"
                        :type="w === 'NEW_ADDRESS' ? 'warning' : 'error'"
                        variant="tonal"
                        density="compact"
                        class="rounded-xl!"
                    >
                        <strong>{{ WARNING_TITLES[w] }}:</strong> {{ WARNING_MESSAGES[w] }}
                    </v-alert>
                </div>

                <div class="flex flex-col gap-4">
                    <div>
                        <p class="mb-1 text-sm text-text-muted">Кому:</p>
                        <p class="break-all font-mono text-sm text-text-primary">
                            {{ to }}
                        </p>
                    </div>

                    <div>
                        <p class="mb-1 text-sm text-text-muted">Сумма:</p>
                        <p class="text-2xl font-bold text-accent">{{ amount }} TON</p>
                    </div>

                    <div v-if="comment">
                        <p class="mb-1 text-sm text-text-muted">Комментарий:</p>
                        <p class="text-sm text-text-primary">{{ comment }}</p>
                    </div>

                    <div>
                        <p class="mb-1 text-sm text-text-muted">Примерная комиссия:</p>
                        <p class="text-sm text-text-secondary">{{ fee }} TON</p>
                    </div>
                </div>
            </v-card-text>

            <div class="flex flex-row gap-3 px-6 pb-6">
                <ButtonError
                    text="Отмена"
                    outlined
                    class="min-w-0 flex-1"
                    @click="emit('cancel')"
                />

                <ButtonAccent
                    text="Подтвердить"
                    class="min-w-0 flex-1"
                    @click="emit('confirm')"
                />
            </div>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.close-btn :deep(.v-btn__overlay) {
    display: none;
}

.close-btn:hover {
    opacity: 0.8;
}

.dialog-card {
    border-radius: 16px;
}

@media (max-width: 600px) {
    .dialog-card {
        border-radius: 16px 16px 0 0;
    }
}
</style>

<style>
.dialog-bottom {
    align-self: flex-end;
}

@media (min-width: 601px) {
    .dialog-bottom {
        align-self: center;
    }
}
</style>
