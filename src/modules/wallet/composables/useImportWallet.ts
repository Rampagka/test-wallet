import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { MNEMONIC_LENGTH } from '@/modules/wallet/consts/mnemonic.ts'
import { useWalletStore } from '@/modules/wallet/store/wallet.store'

export const useImportWallet = () => {
    const router = useRouter()
    const walletStore = useWalletStore()

    const words = ref<string[]>(Array.from({ length: MNEMONIC_LENGTH }, () => ''))
    const error = ref('')
    const isImporting = ref(false)

    const allFilled = computed(() => words.value.every((w) => w.trim().length > 0))

    function onPaste(event: ClipboardEvent, index: number) {
        const text = event.clipboardData?.getData('text')?.trim()
        if (!text) return

        const pastedWords = text.split(/\s+/)
        if (pastedWords.length > 1) {
            event.preventDefault()
            const newWords = [...words.value]
            for (let i = 0; i < pastedWords.length && index + i < MNEMONIC_LENGTH; i++) {
                newWords[index + i] = pastedWords[i]!.toLowerCase()
            }
            words.value = newWords
        }
    }

    function onInput(value: string, index: number) {
        words.value[index] = value.toLowerCase().trim()
        error.value = ''
    }

    async function importWallet() {
        error.value = ''
        isImporting.value = true

        try {
            const mnemonic = words.value.map((w) => w.trim().toLowerCase())
            await walletStore.importWallet(mnemonic)
            router.push('/dashboard')
        } catch {
            error.value = 'Неверная мнемоническая фраза. Проверьте слова и попробуйте снова.'
        } finally {
            isImporting.value = false
        }
    }

    return {
        words,
        error,
        isImporting,
        allFilled,
        onPaste,
        onInput,
        importWallet,
    }
}
