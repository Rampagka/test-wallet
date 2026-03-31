import type { WalletAccount } from '@/modules/wallet/models/types/wallet-account'

import { deriveWalletAddress, validateMnemonic } from '@/modules/wallet/services/wallet.service'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface PersistedState {
    accounts: WalletAccount[]
    activeIndex: number
    // Legacy single-wallet fields (for migration)
    mnemonic?: string[]
    address?: string
    isInitialized?: boolean
}

export const useWalletStore = defineStore(
    'wallet',
    () => {
        const accounts = ref<WalletAccount[]>([])
        const activeIndex = ref(0)

        const activeAccount = computed(() => accounts.value[activeIndex.value])
        const mnemonic = computed(() => activeAccount.value?.mnemonic ?? [])
        const address = computed(() => activeAccount.value?.address ?? '')
        const isInitialized = computed(() => accounts.value.length > 0)

        const shortAddress = computed(() => {
            if (!address.value) return ''
            return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
        })

        function nextWalletName(): string {
            return `Wallet ${accounts.value.length + 1}`
        }

        async function createWallet(words: string[]) {
            const walletAddress = await deriveWalletAddress(words)

            accounts.value.push({
                name: nextWalletName(),
                mnemonic: words,
                address: walletAddress,
            })
            activeIndex.value = accounts.value.length - 1
        }

        async function importWallet(words: string[]) {
            const isValid = await validateMnemonic(words)
            if (!isValid) {
                throw new Error('Неверная мнемоническая фраза')
            }

            const walletAddress = await deriveWalletAddress(words)

            const existing = accounts.value.findIndex((a) => a.address === walletAddress)
            if (existing !== -1) {
                activeIndex.value = existing
                return
            }

            accounts.value.push({
                name: nextWalletName(),
                mnemonic: words,
                address: walletAddress,
            })
            activeIndex.value = accounts.value.length - 1
        }

        function switchAccount(index: number) {
            if (index >= 0 && index < accounts.value.length) {
                activeIndex.value = index
            }
        }

        function removeAccount(index: number) {
            if (accounts.value.length <= 1) {
                clearWallet()
                return
            }

            accounts.value.splice(index, 1)

            if (activeIndex.value >= accounts.value.length) {
                activeIndex.value = accounts.value.length - 1
            } else if (activeIndex.value > index) {
                activeIndex.value--
            }
        }

        function clearWallet() {
            accounts.value = []
            activeIndex.value = 0
        }

        return {
            accounts,
            activeIndex,
            activeAccount,
            mnemonic,
            address,
            isInitialized,
            shortAddress,
            createWallet,
            importWallet,
            switchAccount,
            removeAccount,
            clearWallet,
        }
    },
    {
        persist: {
            afterHydrate(ctx) {
                // Migrate legacy single-wallet format to multi-account
                const raw = ctx.store.$state as PersistedState
                if (!raw.accounts && raw.mnemonic && raw.address && raw.isInitialized) {
                    ctx.store.accounts = [
                        {
                            name: 'Wallet 1',
                            mnemonic: raw.mnemonic,
                            address: raw.address,
                        },
                    ]
                    ctx.store.activeIndex = 0
                }
            },
        },
    },
)
