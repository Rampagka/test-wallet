import tonClient from '@/common/services/ton-client'

import { Address } from '@ton/core'

export async function getBalance(addressStr: string): Promise<bigint> {
    const address = Address.parse(addressStr)
    return tonClient.getBalance(address)
}
