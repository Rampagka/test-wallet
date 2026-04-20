import { Address } from '@ton/core'
import { describe, expect, it } from 'vitest'

import {
    highlightDifferences,
    isBounceable,
    isSimilarAddress,
    isValidTonAddress,
} from './address-validation'

// Real addresses derived from known hashes — guaranteed parseable by @ton/core
const hash1 = Buffer.alloc(32, 0xaa)
const hash2 = Buffer.alloc(32, 0xbb)

const BOUNCEABLE = new Address(0, hash1).toString({ bounceable: true, testOnly: false })
const NON_BOUNCEABLE = new Address(0, hash1).toString({ bounceable: false, testOnly: false })
const BOUNCEABLE_2 = new Address(0, hash2).toString({ bounceable: true, testOnly: false })

describe('isValidTonAddress', () => {
    it('accepts a valid bounceable address', () => {
        expect(isValidTonAddress(BOUNCEABLE)).toBe(true)
    })

    it('accepts a valid non-bounceable address', () => {
        expect(isValidTonAddress(NON_BOUNCEABLE)).toBe(true)
    })

    it('rejects an empty string', () => {
        expect(isValidTonAddress('')).toBe(false)
    })

    it('rejects a random string', () => {
        expect(isValidTonAddress('not-an-address')).toBe(false)
    })

    it('rejects a truncated address', () => {
        expect(isValidTonAddress(BOUNCEABLE.slice(0, 20))).toBe(false)
    })
})

describe('isBounceable', () => {
    it('returns true for EQ-prefixed (bounceable) address', () => {
        expect(BOUNCEABLE.startsWith('EQ')).toBe(true)
        expect(isBounceable(BOUNCEABLE)).toBe(true)
    })

    it('returns false for UQ-prefixed (non-bounceable) address', () => {
        expect(NON_BOUNCEABLE.startsWith('UQ')).toBe(true)
        expect(isBounceable(NON_BOUNCEABLE)).toBe(false)
    })

    it('returns false for an invalid address', () => {
        expect(isBounceable('garbage')).toBe(false)
    })

    it('returns false for an empty string', () => {
        expect(isBounceable('')).toBe(false)
    })
})

describe('isSimilarAddress', () => {
    it('returns not similar when compare list is empty', () => {
        const result = isSimilarAddress(BOUNCEABLE, [])
        expect(result.isSimilar).toBe(false)
    })

    it('skips exact match and returns not similar', () => {
        const result = isSimilarAddress(BOUNCEABLE, [BOUNCEABLE])
        expect(result.isSimilar).toBe(false)
    })

    it('detects poisoning: same prefix+suffix but different middle', () => {
        const prefix = BOUNCEABLE.slice(0, 6)
        const suffix = BOUNCEABLE.slice(-4)
        const padded = prefix + 'X'.repeat(BOUNCEABLE.length - 10) + suffix

        const result = isSimilarAddress(BOUNCEABLE, [padded])
        expect(result.isSimilar).toBe(true)
        expect(result.matchedAddress).toBe(padded)
    })

    it('returns not similar for completely different addresses', () => {
        const result = isSimilarAddress(BOUNCEABLE, [BOUNCEABLE_2])
        expect(result.isSimilar).toBe(false)
    })

    it('returns the first matched address', () => {
        const prefix = BOUNCEABLE.slice(0, 6)
        const suffix = BOUNCEABLE.slice(-4)
        const similar = prefix + 'Y'.repeat(BOUNCEABLE.length - 10) + suffix

        const result = isSimilarAddress(BOUNCEABLE, [BOUNCEABLE_2, similar])
        expect(result.isSimilar).toBe(true)
        expect(result.matchedAddress).toBe(similar)
    })
})

describe('highlightDifferences', () => {
    it('marks nothing as different when strings are equal', () => {
        const result = highlightDifferences('ABCD', 'ABCD')
        expect(result.every((r) => !r.isDifferent)).toBe(true)
        expect(result.map((r) => r.char).join('')).toBe('ABCD')
    })

    it('marks differing characters correctly', () => {
        const result = highlightDifferences('ABCD', 'ABXD')
        expect(result[0]!.isDifferent).toBe(false)
        expect(result[1]!.isDifferent).toBe(false)
        expect(result[2]!.isDifferent).toBe(true)
        expect(result[3]!.isDifferent).toBe(false)
    })

    it('handles strings of different lengths', () => {
        const result = highlightDifferences('AB', 'ABCD')
        expect(result.length).toBe(4)
        expect(result[2]!.isDifferent).toBe(true)
        expect(result[3]!.isDifferent).toBe(true)
    })

    it('uses char from address1 when present, address2 otherwise', () => {
        const result = highlightDifferences('AB', 'ABCD')
        expect(result[2]!.char).toBe('C')
        expect(result[3]!.char).toBe('D')
    })
})
