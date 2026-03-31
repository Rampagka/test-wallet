import { onMounted, onUnmounted, ref } from 'vue'

interface UsePollingOptions {
    fn: () => Promise<void>
    interval: number
    immediate?: boolean
}

export function usePolling(options: UsePollingOptions) {
    const { fn, interval, immediate = true } = options

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    let timerId: ReturnType<typeof setInterval> | null = null
    let isFirstCall = true

    async function execute() {
        if (isFirstCall) {
            isLoading.value = true
            isFirstCall = false
        }

        try {
            await fn()
            error.value = null
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Неизвестная ошибка'
        } finally {
            isLoading.value = false
        }
    }

    async function refresh() {
        isLoading.value = true
        await execute()
    }

    onMounted(() => {
        if (immediate) {
            execute()
        }
        timerId = setInterval(execute, interval)
    })

    onUnmounted(() => {
        if (timerId !== null) {
            clearInterval(timerId)
            timerId = null
        }
    })

    return { isLoading, error, refresh }
}
