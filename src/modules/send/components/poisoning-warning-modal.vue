<script setup lang="ts">
import { ButtonAccent, ButtonError } from '@/common/ui'

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
        content-class="dialog-bottom"
        scrim="black"
    >
        <v-card class="dialog-card">
            <v-card-title class="relative pt-6 text-center text-xl font-bold text-error">
                Предупреждение о похожем адресе

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
                <v-alert
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mb-4 rounded-xl! alert"
                >
                    Этот адрес похож на адрес из вашей истории транзакций. Проверьте внимательно!
                </v-alert>

                <div class="flex flex-col gap-4">
                    <div>
                        <p class="mb-2 text-sm font-semibold text-text-muted">Вы вводите:</p>
                        <div
                            class="break-all rounded-xl bg-error-darken-1 px-3 py-2 font-mono text-sm"
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

                    <div>
                        <p class="mb-2 text-sm font-semibold text-text-muted">
                            Похожий адрес из истории:
                        </p>
                        <div
                            class="break-all rounded-xl bg-surface-variant px-3 py-2 font-mono text-sm"
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
                <ButtonAccent text="Отменить" class="min-w-0 flex-1" @click="emit('cancel')" />

                <ButtonError
                    text="Продолжить"
                    outlined
                    class="min-w-0 flex-1"
                    @click="emit('proceed')"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.alert {
    padding: 8px;
}
.alert :deep(.v-alert__prepend) {
    margin-right: 8px;
}

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
