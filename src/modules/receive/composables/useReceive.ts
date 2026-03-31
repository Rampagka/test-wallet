import { useClipboard } from '@/common/composables/useClipboard'

import { useWalletStore } from '@/modules/wallet'

import { computed } from 'vue'

export function useReceive() {
    const walletStore = useWalletStore()
    const { isCopied, copy } = useClipboard()

    const address = computed(() => walletStore.address)

    async function copyAddress() {
        if (address.value) {
            await copy(address.value)
        }
    }

    return {
        address,
        copyAddress,
        isCopied,
    }
}
