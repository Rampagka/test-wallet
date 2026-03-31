import { rateLimited } from '@/common/helpers/rate-limiter'
import tonClient from '@/common/services/ton-client'

import { Address } from '@ton/core'

export async function getBalance(addressStr: string): Promise<bigint> {
    const address = Address.parse(addressStr)
    return rateLimited(() => tonClient.getBalance(address))
}
