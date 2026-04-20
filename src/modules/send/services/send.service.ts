import { rateLimited } from '@/common/helpers/rate-limiter'
import tonClient from '@/common/services/ton-client'

import { SendMode, internal } from '@ton/core'
import { mnemonicToPrivateKey } from '@ton/crypto'
import { WalletContractV5R1 } from '@ton/ton'

interface SendTransactionParams {
    mnemonic: string[]
    to: string
    amount: string
    comment?: string
}

/**
 * Отправка TON транзакции
 * Возвращает seqno для отслеживания подтверждения
 */
export async function sendTransaction(params: SendTransactionParams): Promise<number> {
    const { mnemonic, to, amount, comment } = params

    const keyPair = await mnemonicToPrivateKey(mnemonic)

    const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
        walletId: { networkGlobalId: -3 },
    })

    const contract = tonClient.open(wallet)

    // Rate-limited API calls
    const seqno = await rateLimited(() => contract.getSeqno())

    const amountNano = BigInt(Math.floor(parseFloat(amount) * 1e9))

    await rateLimited(() =>
        contract.sendTransfer({
            secretKey: keyPair.secretKey,
            seqno,
            sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
            messages: [
                internal({
                    to,
                    value: amountNano,
                    bounce: false,
                    body: comment,
                }),
            ],
        }),
    )

    return seqno
}

export class ConfirmationTimeoutError extends Error {
    constructor() {
        super('Confirmation timeout')
        this.name = 'ConfirmationTimeoutError'
    }
}

/**
 * Ожидание подтверждения транзакции
 * Проверяет изменение seqno каждые 8 секунд
 */
export async function waitForConfirmation(
    mnemonic: string[],
    expectedSeqno: number,
    timeout = 60000,
): Promise<void> {
    const keyPair = await mnemonicToPrivateKey(mnemonic)
    const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
        walletId: { networkGlobalId: -3 },
    })

    const contract = tonClient.open(wallet)
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
        const currentSeqno = await rateLimited(() => contract.getSeqno())

        if (currentSeqno > expectedSeqno) {
            return
        }

        await new Promise((resolve) => setTimeout(resolve, 8000))
    }

    throw new ConfirmationTimeoutError()
}
