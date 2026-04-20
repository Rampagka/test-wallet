<script setup lang="ts">
import { ButtonAccent, ButtonError } from '@/common/ui'

import type { Contact } from '@/modules/contacts/models/types'

import { isValidTonAddress } from '@/modules/send'

import { computed, ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean
    contact?: Contact | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    save: [data: { name: string; address: string }]
}>()

const name = ref('')
const address = ref('')
const isValid = ref(false)

const nameRules = [
    (v: string) => !!v || 'Имя обязательно',
    (v: string) => v.length <= 50 || 'Максимум 50 символов',
]

const addressRules = [
    (v: string) => !!v || 'Адрес обязателен',
    (v: string) => isValidTonAddress(v) || 'Некорректный TON адрес',
]

const isEditMode = computed(() => !!props.contact)

const title = computed(() => (isEditMode.value ? 'Редактировать контакт' : 'Добавить контакт'))

const submitButtonText = computed(() => (isEditMode.value ? 'Сохранить' : 'Добавить'))

watch(
    () => props.contact,
    (newContact) => {
        if (newContact) {
            name.value = newContact.name
            address.value = newContact.address
        } else {
            name.value = ''
            address.value = ''
        }
    },
    { immediate: true },
)

function handleClose() {
    emit('update:modelValue', false)
    setTimeout(() => {
        name.value = ''
        address.value = ''
    }, 300)
}

function handleSave() {
    if (!isValid.value) return

    emit('save', {
        name: name.value,
        address: address.value,
    })

    handleClose()
}
</script>

<template>
    <v-dialog
        :model-value="modelValue"
        max-width="500"
        @update:model-value="handleClose"
        content-class="dialog-bottom"
        scrim="black"
    >
        <v-card class="dialog-card">
            <div class="flex items-center justify-between px-6 py-4 text-center">
                <h4 class="text-xl font-bold">{{ title }}</h4>

                <v-btn
                    icon
                    variant="text"
                    size="large"
                    class="close-btn max-h-6! max-w-6! p-0"
                    @click="handleClose"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>

            <v-card-text class="px-6 py-4">
                <v-form v-model="isValid" @submit.prevent="handleSave">
                    <div class="flex flex-col gap-4">
                        <v-text-field
                            v-model="name"
                            label="Имя контакта"
                            variant="underlined"
                            :rules="nameRules"
                            counter="50"
                            maxlength="50"
                            autofocus
                            required
                        />
                        <v-text-field
                            v-model="address"
                            label="TON адрес"
                            variant="underlined"
                            :rules="addressRules"
                            required
                        />
                        <!--                        <v-textarea-->
                        <!--                            v-model="address"-->
                        <!--                            label="TON адрес"-->
                        <!--                            variant="underlined"-->
                        <!--                            :rules="addressRules"-->
                        <!--                            rows="3"-->
                        <!--                            auto-grow-->
                        <!--                            required-->
                        <!--                            hint="Введите полный адрес получателя"-->
                        <!--                        />-->
                    </div>
                </v-form>
            </v-card-text>

            <div class="flex flex-row gap-3 px-6 pb-6">
                <ButtonError text="Отмена" outlined class="min-w-0 flex-1" @click="handleClose" />

                <ButtonAccent
                    :text="submitButtonText"
                    class="min-w-0 flex-1"
                    :disabled="!isValid"
                    @click="handleSave"
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
