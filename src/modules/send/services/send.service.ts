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

    // Получаем ключевую пару из мнемоники
    const keyPair = await mnemonicToPrivateKey(mnemonic)

    // Создаем wallet контракт
    const wallet = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
        workchain: 0,
        walletId: { networkGlobalId: -3 }, // testnet
    })

    // Открываем контракт через клиент
    const contract = tonClient.open(wallet)

    // Получаем текущий seqno
    const seqno = await contract.getSeqno()

    // Конвертируем сумму в nano
    const amountNano = BigInt(Math.floor(parseFloat(amount) * 1e9))

    // Отправляем транзакцию
    await contract.sendTransfer({
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
    })

    return seqno
}

/**
 * Ожидание подтверждения транзакции
 * Проверяет изменение seqno каждые 2 секунды
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
        const currentSeqno = await contract.getSeqno()

        if (currentSeqno > expectedSeqno) {
            return // Транзакция подтверждена
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
    }

    throw new Error('Timeout waiting for transaction confirmation')
}
