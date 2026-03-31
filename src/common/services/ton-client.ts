import { TonClient } from '@ton/ton'

const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: import.meta.env.VITE_TONCENTER_API_KEY || undefined,
})

export default tonClient
