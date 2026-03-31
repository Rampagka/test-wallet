import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
    deriveWalletAddress,
    validateMnemonic,
} from '@/modules/wallet/services/wallet.service'

export const useWalletStore = defineStore(
    'wallet',
    () => {
        const mnemonic = ref<string[]>([])
        const address = ref('')
        const isInitialized = ref(false)

        const shortAddress = computed(() => {
            if (!address.value) return ''
            return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
        })

        async function createWallet(words: string[]) {
            const walletAddress = await deriveWalletAddress(words)

            mnemonic.value = words
            address.value = walletAddress
            isInitialized.value = true
        }

        async function importWallet(words: string[]) {
            const isValid = await validateMnemonic(words)
            if (!isValid) {
                throw new Error('Неверная мнемоническая фраза')
            }

            const walletAddress = await deriveWalletAddress(words)

            mnemonic.value = words
            address.value = walletAddress
            isInitialized.value = true
        }

        function clearWallet() {
            mnemonic.value = []
            address.value = ''
            isInitialized.value = false
        }

        return {
            mnemonic,
            address,
            isInitialized,
            shortAddress,
            createWallet,
            importWallet,
            clearWallet,
        }
    },
    { persist: true },
)
