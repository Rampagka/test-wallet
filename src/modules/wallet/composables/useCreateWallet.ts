import { generateMnemonic, useWalletStore } from '@/modules/wallet'

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCreateWallet = () => {
    const router = useRouter()
    const walletStore = useWalletStore()

    const words = ref<string[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)
    const isCopied = ref(false)

    onMounted(async () => {
        words.value = await generateMnemonic()
        isLoading.value = false
    })

    async function copyMnemonic() {
        await navigator.clipboard.writeText(words.value.join(' '))
        isCopied.value = true
        setTimeout(() => {
            isCopied.value = false
        }, 2000)
    }

    async function confirmSaved() {
        isSaving.value = true
        try {
            await walletStore.createWallet(words.value)
            router.push('/dashboard')
        } finally {
            isSaving.value = false
        }
    }

    return {
        words,
        isLoading,
        isSaving,
        isCopied,
        copyMnemonic,
        confirmSaved,
    }
}
