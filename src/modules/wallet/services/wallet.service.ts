import { mnemonicNew, mnemonicToPrivateKey, mnemonicValidate } from '@ton/crypto'
import { WalletContractV5R1 } from '@ton/ton'

import {
    TON_NETWORK_GLOBAL_ID,
    TON_WORKCHAIN,
} from '@/modules/wallet/consts/ton-config'

export async function generateMnemonic(): Promise<string[]> {
    return mnemonicNew()
}

export async function validateMnemonic(words: string[]): Promise<boolean> {
    return mnemonicValidate(words)
}

export async function deriveWalletAddress(mnemonic: string[]): Promise<string> {
    const keyPair = await mnemonicToPrivateKey(mnemonic)

    const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: TON_WORKCHAIN,
        walletId: { networkGlobalId: TON_NETWORK_GLOBAL_ID },
    })

    return wallet.address.toString({ testOnly: true, bounceable: false })
}
