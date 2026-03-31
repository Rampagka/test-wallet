import { Address } from '@ton/core'

import tonClient from '@/common/services/ton-client'

export async function getBalance(addressStr: string): Promise<bigint> {
    const address = Address.parse(addressStr)
    return tonClient.getBalance(address)
}
