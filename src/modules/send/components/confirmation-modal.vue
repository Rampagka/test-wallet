<script setup lang="ts">
interface Props {
    isOpen: boolean
    to: string
    amount: string
    comment?: string
    fee: string
}

defineProps<Props>()

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
    >
        <v-card class="rounded-xl">
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
                <div class="flex flex-col gap-4">
                    <!-- Адрес получателя (полный, без сокращения) -->
                    <div>
                        <p class="mb-1 text-sm text-text-muted">Кому:</p>
                        <p class="break-all font-mono text-sm text-text-primary">
                            {{ to }}
                        </p>
                    </div>

                    <!-- Сумма -->
                    <div>
                        <p class="mb-1 text-sm text-text-muted">Сумма:</p>
                        <p class="text-2xl font-bold text-primary">{{ amount }} TON</p>
                    </div>

                    <!-- Комментарий -->
                    <div v-if="comment">
                        <p class="mb-1 text-sm text-text-muted">Комментарий:</p>
                        <p class="text-sm text-text-primary">{{ comment }}</p>
                    </div>

                    <!-- Комиссия -->
                    <div>
                        <p class="mb-1 text-sm text-text-muted">Примерная комиссия:</p>
                        <p class="text-sm text-text-secondary">{{ fee }} TON</p>
                    </div>
                </div>
            </v-card-text>

            <div class="flex flex-row gap-3 px-6 pb-6">
                <v-btn
                    variant="outlined"
                    size="large"
                    rounded="lg"
                    class="cancel-btn min-w-0 flex-1"
                    @click="emit('cancel')"
                >
                    Отмена
                </v-btn>

                <v-btn
                    color="primary"
                    size="large"
                    rounded="lg"
                    class="min-w-0 flex-1"
                    @click="emit('confirm')"
                >
                    Подтвердить
                </v-btn>
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

.cancel-btn {
    border: 1px solid rgb(var(--v-theme-primary));
    color: #fff !important;
}

.cancel-btn :deep(.v-btn__overlay) {
    display: none;
}

.cancel-btn:hover {
    background-color: rgb(var(--v-theme-primary));
}
</style>
