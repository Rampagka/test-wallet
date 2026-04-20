import type { SendFormData, SendFormErrors } from '@/modules/send/models/types/send-form'
import type { WarningType } from '@/modules/send/models/types/warning-type'

import {
    isBounceable,
    isSimilarAddress,
    isValidTonAddress,
} from '@/modules/send/helpers/address-validation'

import {
    ConfirmationTimeoutError,
    sendTransaction,
    waitForConfirmation,
} from '@/modules/send/services/send.service'

import { useContactsStore } from '@/modules/contacts'
import { useDashboardStore } from '@/modules/dashboard'
import { useWalletStore } from '@/modules/wallet'

import { fromNano } from '@ton/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useSend() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const dashboardStore = useDashboardStore()
    const contactsStore = useContactsStore()

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
    const activeWarnings = ref<WarningType[]>([])

    // Состояния отправки
    const isSending = ref(false)
    const sendSuccess = ref(false)
    const sendPending = ref(false)
    const sendError = ref('')

    // Вычисляемые значения
    const balance = computed(() => dashboardStore.balanceFormatted)
    const balanceNumber = computed(() => parseFloat(fromNano(dashboardStore.balanceNano)))

    const estimatedFee = '0.01' // Примерная комиссия в TON

    // Адреса из истории + контактов для проверки address poisoning
    const knownAddresses = computed(() => {
        const txAddresses = dashboardStore.transactions.map((tx) => tx.address)
        const contactAddresses = contactsStore.contacts.map((c) => c.address)
        return [...txAddresses, ...contactAddresses]
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
    function checkWarnings(): WarningType[] {
        const warnings: WarningType[] = []

        // Address poisoning
        const { isSimilar, matchedAddress } = isSimilarAddress(
            formData.value.address,
            knownAddresses.value,
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

        // New address — never interacted before
        const addr = formData.value.address
        const isKnown = knownAddresses.value.some(
            (known) => known.toLowerCase() === addr.toLowerCase(),
        )
        if (!isKnown && addr !== walletStore.address) {
            warnings.push('NEW_ADDRESS')
        }

        return warnings
    }

    /**
     * Обработка отправки формы
     */
    function handleSubmit() {
        if (!validateForm()) return

        const warnings = checkWarnings()
        activeWarnings.value = warnings

        // Если есть address poisoning → показываем специальный модал
        if (warnings.includes('ADDRESS_POISONING')) {
            isPoisoningWarningModalOpen.value = true
            return
        }

        // Открываем модал подтверждения (с предупреждениями внутри если есть)
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
        sendPending.value = false

        try {
            const seqno = await sendTransaction({
                mnemonic: walletStore.mnemonic,
                to: formData.value.address,
                amount: formData.value.amount,
                comment: formData.value.comment || undefined,
            })

            await waitForConfirmation(walletStore.mnemonic, seqno)

            sendSuccess.value = true

            await dashboardStore.fetchBalance(walletStore.address)
            await dashboardStore.fetchTransactions(walletStore.address)

            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (error) {
            if (error instanceof ConfirmationTimeoutError) {
                // Транзакция отправлена, но подтверждение затянулось — не показываем ошибку
                sendPending.value = true
                await dashboardStore.fetchBalance(walletStore.address)
                await dashboardStore.fetchTransactions(walletStore.address)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 4000)
            } else {
                sendError.value =
                    error instanceof Error ? error.message : 'Ошибка при отправке транзакции'
            }
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
    }
}
