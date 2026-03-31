<script setup lang="ts">
import { highlightDifferences } from '@/modules/send/helpers/address-validation'

import { computed } from 'vue'

interface Props {
    isOpen: boolean
    enteredAddress: string
    similarAddress: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    proceed: []
    cancel: []
}>()

const differences = computed(() => {
    if (!props.enteredAddress || !props.similarAddress) return []
    return highlightDifferences(props.enteredAddress, props.similarAddress)
})
</script>

<template>
    <v-dialog
        :model-value="isOpen"
        max-width="600"
        @update:model-value="(v) => !v && emit('cancel')"
    >
        <v-card class="rounded-xl">
            <v-card-title class="relative pt-6 text-center text-xl font-bold text-error">
                ⚠️ Предупреждение о похожем адресе

                <v-btn
                    icon
                    variant="text"
                    size="small"
                    class="close-btn absolute right-2 top-2"
                    @click="emit('cancel')"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="px-6 py-4">
                <v-alert type="error" variant="tonal" density="compact" class="mb-4">
                    Этот адрес похож на адрес из вашей истории транзакций. Проверьте внимательно!
                </v-alert>

                <div class="flex flex-col gap-4">
                    <!-- Введенный адрес -->
                    <div>
                        <p class="mb-2 text-sm font-semibold text-text-muted">Вы вводите:</p>
                        <div
                            class="break-all rounded-lg bg-error-darken-1 px-3 py-2 font-mono text-sm"
                        >
                            <span
                                v-for="(item, idx) in differences"
                                :key="idx"
                                :class="{ 'bg-error text-white': item.isDifferent }"
                            >
                                {{ item.char }}
                            </span>
                        </div>
                    </div>

                    <!-- Похожий адрес из истории -->
                    <div>
                        <p class="mb-2 text-sm font-semibold text-text-muted">
                            Похожий адрес из истории:
                        </p>
                        <div
                            class="break-all rounded-lg bg-surface-variant px-3 py-2 font-mono text-sm"
                        >
                            {{ similarAddress }}
                        </div>
                    </div>

                    <p class="text-center text-xs text-text-muted">
                        Красным выделены отличающиеся символы
                    </p>
                </div>
            </v-card-text>

            <v-card-actions class="flex flex-row gap-3 px-6 pb-6">
                <v-btn
                    color="primary"
                    size="large"
                    rounded="lg"
                    class="min-w-0 flex-1"
                    @click="emit('cancel')"
                >
                    Отменить
                </v-btn>

                <v-btn
                    variant="outlined"
                    size="large"
                    rounded="lg"
                    class="proceed-btn min-w-0 flex-1"
                    @click="emit('proceed')"
                >
                    Продолжить всё равно
                </v-btn>
            </v-card-actions>
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

.proceed-btn {
    border: 1px solid rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-error)) !important;
}

.proceed-btn :deep(.v-btn__overlay) {
    display: none;
}

.proceed-btn:hover {
    background-color: rgb(var(--v-theme-error));
    color: #fff !important;
}
</style>
