import { formatShortAddress } from '@/common/helpers/format-address'
import { formatTonAmount } from '@/common/helpers/format-ton'
import { rateLimited } from '@/common/helpers/rate-limiter'
import tonClient from '@/common/services/ton-client'

import type { Transaction } from '@/modules/dashboard/models/types/transaction'
import type { TransactionDirection } from '@/modules/dashboard/models/types/transaction-direction'

import { DUST_THRESHOLD_NANO, TRANSACTION_FETCH_LIMIT } from '@/modules/dashboard/consts/dashboard'

import { Address, type Cell, fromNano } from '@ton/core'
import type { Transaction as RawTransaction } from '@ton/ton'

export async function getTransactions(
    addressStr: string,
    knownAddresses: Set<string> = new Set(),
): Promise<Transaction[]> {
    const address = Address.parse(addressStr)
    const rawTxs = await rateLimited(() =>
        tonClient.getTransactions(address, {
            limit: TRANSACTION_FETCH_LIMIT,
        }),
    )
    return rawTxs.map((tx) => parseTransaction(tx, addressStr, knownAddresses))
}

function parseTransaction(
    tx: RawTransaction,
    ownAddress: string,
    knownAddresses: Set<string>,
): Transaction {
    const hash = tx.hash().toString('hex')
    const lt = tx.lt.toString()
    const timestamp = tx.now

    let direction: TransactionDirection = 'out'
    let counterpartyAddress = ''
    let amountNano = '0'

    const inMsg = tx.inMessage
    if (inMsg?.info.type === 'internal' && inMsg.info.value.coins > 0n) {
        direction = 'in'
        amountNano = inMsg.info.value.coins.toString()
        counterpartyAddress = inMsg.info.src.toString({
            testOnly: true,
            bounceable: false,
        })
    } else {
        const outMessages = tx.outMessages.values()
        const firstOut = outMessages[0]
        if (firstOut?.info.type === 'internal') {
            direction = 'out'
            amountNano = firstOut.info.value.coins.toString()
            counterpartyAddress = firstOut.info.dest.toString({
                testOnly: true,
                bounceable: false,
            })
        }
    }

    const body = direction === 'in' ? inMsg?.body : tx.outMessages.values()[0]?.body
    const comment = parseComment(body)

    const amount = formatTonAmount(fromNano(BigInt(amountNano)))

    const isDust =
        direction === 'in' &&
        BigInt(amountNano) < BigInt(DUST_THRESHOLD_NANO) &&
        BigInt(amountNano) > 0n &&
        counterpartyAddress !== ownAddress &&
        !knownAddresses.has(counterpartyAddress)

    return {
        hash,
        lt,
        timestamp,
        direction,
        address: counterpartyAddress,
        shortAddress: counterpartyAddress ? formatShortAddress(counterpartyAddress) : 'Неизвестно',
        amount,
        amountNano,
        comment,
        isDust,
    }
}

function parseComment(body: Cell | undefined): string {
    if (!body) return ''
    try {
        const slice = body.beginParse()
        if (slice.remainingBits < 32) return ''
        const opcode = slice.loadUint(32)
        if (opcode !== 0) return ''
        return slice.loadStringTail()
    } catch {
        return ''
    }
}
