import { ref } from 'vue'

export function useClipboard(resetDelay = 2000) {
    const isCopied = ref(false)

    async function copy(text: string) {
        await navigator.clipboard.writeText(text)
        isCopied.value = true
        setTimeout(() => {
            isCopied.value = false
        }, resetDelay)
    }

    return { isCopied, copy }
}
