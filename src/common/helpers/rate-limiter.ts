const MIN_INTERVAL_MS = 1100 // 1.1 sec between requests (free tier = 1 req/sec)
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 2000

let lastRequestTime = 0
let requestQueue: Promise<void> = Promise.resolve()

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute an async function with rate limiting (sequential queue).
 * Ensures minimum interval between API requests to toncenter.
 * Retries on 429 with exponential backoff.
 */
export async function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        requestQueue = requestQueue.then(async () => {
            const now = Date.now()
            const waitTime = Math.max(0, MIN_INTERVAL_MS - (now - lastRequestTime))
            if (waitTime > 0) {
                await delay(waitTime)
            }

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    lastRequestTime = Date.now()
                    const result = await fn()
                    resolve(result)
                    return
                } catch (error: unknown) {
                    const is429 =
                        error instanceof Error &&
                        (error.message.includes('429') || error.message.includes('Too Many'))

                    if (is429 && attempt < MAX_RETRIES) {
                        const backoff = RETRY_BASE_DELAY_MS * Math.pow(2, attempt)
                        await delay(backoff)
                        lastRequestTime = Date.now()
                        continue
                    }

                    reject(error)
                    return
                }
            }
        })
    })
}
