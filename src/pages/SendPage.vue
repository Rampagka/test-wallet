<script setup lang="ts">
import BackButton from '@/common/components/back-button.vue'

import { useContactsStore } from '@/modules/contacts'
import { useDashboard } from '@/modules/dashboard'
import { ConfirmationModal, PoisoningWarningModal, SendForm, useSend } from '@/modules/send'

const contactsStore = useContactsStore()

const {
    formData,
    errors,
    balance,
    estimatedFee,
    isConfirmationModalOpen,
    isPoisoningWarningModalOpen,
    similarAddressFound,
    activeWarnings,
    isSending,
    sendSuccess,
    sendPending,
    sendError,
    handleSubmit,
    proceedAfterPoisoningWarning,
    cancelPoisoningWarning,
    confirmSend,
    cancelSend,
    setMaxAmount,
} = useSend()

useDashboard()
</script>

<template>
    <div class="pb-2">
        <v-container class="pa-4">
            <!-- Хедер -->
            <div class="mb-6 flex items-center">
                <BackButton />
                <h1 class="ml-2 text-xl font-bold">Отправить ТОН</h1>
            </div>

            <!-- Форма отправки -->
            <SendForm
                v-model:address="formData.address"
                v-model:amount="formData.amount"
                v-model:comment="formData.comment"
                :errors="errors"
                :balance="balance"
                :is-loading="isSending"
                :contacts="contactsStore.contacts"
                @submit="handleSubmit"
                @set-max-amount="setMaxAmount"
            />

            <!-- Модал подтверждения -->
            <ConfirmationModal
                :is-open="isConfirmationModalOpen"
                :to="formData.address"
                :amount="formData.amount"
                :comment="formData.comment"
                :fee="estimatedFee"
                :warnings="activeWarnings"
                @confirm="confirmSend"
                @cancel="cancelSend"
            />

            <!-- Модал предупреждения о poisoning -->
            <PoisoningWarningModal
                :is-open="isPoisoningWarningModalOpen"
                :entered-address="formData.address"
                :similar-address="similarAddressFound"
                @proceed="proceedAfterPoisoningWarning"
                @cancel="cancelPoisoningWarning"
            />

            <!-- Snackbar успешной отправки -->
            <v-snackbar v-model="sendSuccess" :timeout="2000" color="success">
                Транзакция отправлена успешно!
            </v-snackbar>

            <!-- Snackbar pending — транзакция ушла, но подтверждение затянулось -->
            <v-snackbar v-model="sendPending" :timeout="4000" color="warning">
                Транзакция отправлена, подтверждение затянулось. Проверьте
                <a
                    href="https://testnet.tonscan.org"
                    target="_blank"
                    rel="noopener"
                    class="font-semibold underline"
                >TonScan</a>.
            </v-snackbar>

            <!-- Snackbar ошибки -->
            <v-snackbar :model-value="!!sendError" :timeout="5000" color="error">
                {{ sendError }}
            </v-snackbar>
        </v-container>
    </div>
</template>
