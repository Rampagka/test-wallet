import type { SendFormData, SendFormErrors } from '@/modules/send/models/types/send-form'

import {
    isBounceable,
    isSimilarAddress,
    isValidTonAddress,
} from '@/modules/send/helpers/address-validation'

import { sendTransaction, waitForConfirmation } from '@/modules/send/services/send.service'

import { useDashboardStore } from '@/modules/dashboard'
import { useWalletStore } from '@/modules/wallet'

import { fromNano } from '@ton/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useSend() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const dashboardStore = useDashboardStore()

    // Состояние формы
    const formData = ref<SendFormData>({
        address: '',
        amount: '',
        comment: '',
    })

    const errors = ref<SendFormErrors>({})

    // Состояния модалов
    const isConfirmationModalOpen = ref(false)
    const isPoisoningWarningModalOpen = ref(false)
    const similarAddressFound = ref('')

    // Состояния отправки
    const isSending = ref(false)
    const sendSuccess = ref(false)
    const sendError = ref('')

    // Вычисляемые значения
    const balance = computed(() => dashboardStore.balanceFormatted)
    const balanceNumber = computed(() => parseFloat(fromNano(dashboardStore.balanceNano)))

    const estimatedFee = '0.01' // Примерная комиссия в TON

    // Список адресов из истории для проверки address poisoning
    const transactionAddresses = computed(() => {
        return dashboardStore.transactions.map((tx) => tx.address)
    })

    /**
     * Валидация формы
     */
    function validateForm(): boolean {
        errors.value = {}

        // Проверка адреса
        if (!formData.value.address) {
            errors.value.address = 'Введите адрес получателя'
            return false
        }

        if (!isValidTonAddress(formData.value.address)) {
            errors.value.address = 'Некорректный TON адрес'
            return false
        }

        // Проверка суммы
        if (!formData.value.amount) {
            errors.value.amount = 'Введите сумму'
            return false
        }

        const amount = parseFloat(formData.value.amount)
        if (isNaN(amount) || amount <= 0) {
            errors.value.amount = 'Сумма должна быть больше 0'
            return false
        }

        if (amount > balanceNumber.value) {
            errors.value.amount = 'Недостаточно средств'
            return false
        }

        return true
    }

    /**
     * Проверка предупреждений
     * Возвращает массив типов предупреждений
     */
    function checkWarnings(): string[] {
        const warnings: string[] = []

        // Address poisoning
        const { isSimilar, matchedAddress } = isSimilarAddress(
            formData.value.address,
            transactionAddresses.value,
        )
        if (isSimilar && matchedAddress) {
            warnings.push('ADDRESS_POISONING')
            similarAddressFound.value = matchedAddress
        }

        // Bounceable address
        if (isBounceable(formData.value.address)) {
            warnings.push('BOUNCEABLE_ADDRESS')
        }

        // Own address
        if (formData.value.address === walletStore.address) {
            warnings.push('OWN_ADDRESS')
        }

        // Entire balance
        const amount = parseFloat(formData.value.amount)
        if (amount >= balanceNumber.value) {
            warnings.push('ENTIRE_BALANCE')
        }

        return warnings
    }

    /**
     * Обработка отправки формы
     */
    function handleSubmit() {
        if (!validateForm()) return

        const warnings = checkWarnings()

        // Если есть address poisoning → показываем специальный модал
        if (warnings.includes('ADDRESS_POISONING')) {
            isPoisoningWarningModalOpen.value = true
            return
        }

        // Иначе просто открываем модал подтверждения
        isConfirmationModalOpen.value = true
    }

    /**
     * Продолжить после предупреждения о poisoning
     */
    function proceedAfterPoisoningWarning() {
        isPoisoningWarningModalOpen.value = false
        isConfirmationModalOpen.value = true
    }

    /**
     * Отмена предупреждения о poisoning
     */
    function cancelPoisoningWarning() {
        isPoisoningWarningModalOpen.value = false
    }

    /**
     * Подтверждение отправки
     */
    async function confirmSend() {
        isConfirmationModalOpen.value = false
        isSending.value = true
        sendError.value = ''
        sendSuccess.value = false

        try {
            const seqno = await sendTransaction({
                mnemonic: walletStore.mnemonic,
                to: formData.value.address,
                amount: formData.value.amount,
                comment: formData.value.comment || undefined,
            })

            // Ждем подтверждения
            await waitForConfirmation(walletStore.mnemonic, seqno)

            sendSuccess.value = true

            // Обновляем баланс и транзакции
            await dashboardStore.fetchBalance(walletStore.address)
            await dashboardStore.fetchTransactions(walletStore.address)

            // Перенаправляем на dashboard через 2 секунды
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error) {
            sendError.value =
                error instanceof Error ? error.message : 'Ошибка при отправке транзакции'
        } finally {
            isSending.value = false
        }
    }

    /**
     * Отмена отправки
     */
    function cancelSend() {
        isConfirmationModalOpen.value = false
    }

    /**
     * Установить максимальную сумму (баланс - комиссия)
     */
    function setMaxAmount() {
        const fee = parseFloat(estimatedFee)
        const maxAmount = Math.max(0, balanceNumber.value - fee)
        formData.value.amount = maxAmount.toFixed(2)
    }

    return {
        formData,
        errors,
        balance,
        estimatedFee,
        isConfirmationModalOpen,
        isPoisoningWarningModalOpen,
        similarAddressFound,
        isSending,
        sendSuccess,
        sendError,
        handleSubmit,
        proceedAfterPoisoningWarning,
        cancelPoisoningWarning,
        confirmSend,
        cancelSend,
        setMaxAmount,
    }
}
