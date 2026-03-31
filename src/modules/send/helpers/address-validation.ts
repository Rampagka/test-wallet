import { Address } from '@ton/core'

/**
 * Проверка валидности TON адреса
 */
export function isValidTonAddress(address: string): boolean {
    try {
        Address.parse(address)
        return true
    } catch {
        return false
    }
}

/**
 * Проверка на bounceable адрес
 * Bounceable адреса начинаются с EQ (base64) или 0: (raw)
 * Non-bounceable начинаются с UQ (base64) или 0- (raw)
 */
export function isBounceable(address: string): boolean {
    try {
        // Парсим адрес для валидации
        Address.parse(address)

        // Проверяем префикс в base64 формате
        if (address.startsWith('EQ')) {
            return true // Bounceable
        }
        if (address.startsWith('UQ')) {
            return false // Non-bounceable
        }

        // Для raw формата проверяем второй символ
        if (address.startsWith('0:')) {
            return true // Bounceable raw
        }
        if (address.startsWith('0-')) {
            return false // Non-bounceable raw
        }

        // По умолчанию считаем non-bounceable
        return false
    } catch {
        return false
    }
}

/**
 * Проверка схожести адресов (prefix + suffix match, middle differs)
 * Используется для обнаружения address poisoning
 */
export function isSimilarAddress(
    address: string,
    compareWith: string[],
    prefixLen = 6,
    suffixLen = 4,
): { isSimilar: boolean; matchedAddress?: string } {
    const prefix = address.slice(0, prefixLen)
    const suffix = address.slice(-suffixLen)

    for (const compareAddress of compareWith) {
        if (compareAddress === address) continue // пропускаем точное совпадение

        const comparePrefix = compareAddress.slice(0, prefixLen)
        const compareSuffix = compareAddress.slice(-suffixLen)

        // Если префикс и суффикс совпадают, но адреса разные → похожий адрес
        if (prefix === comparePrefix && suffix === compareSuffix) {
            return { isSimilar: true, matchedAddress: compareAddress }
        }
    }

    return { isSimilar: false }
}

/**
 * Подсветка различий между двумя адресами
 * Возвращает массив объектов с символами и флагом isDifferent
 */
export function highlightDifferences(
    address1: string,
    address2: string,
): { char: string; isDifferent: boolean }[] {
    const maxLen = Math.max(address1.length, address2.length)
    const result: { char: string; isDifferent: boolean }[] = []

    for (let i = 0; i < maxLen; i++) {
        const char1 = address1[i] || ''
        const char2 = address2[i] || ''
        result.push({
            char: char1 || char2,
            isDifferent: char1 !== char2,
        })
    }

    return result
}
