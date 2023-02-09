import { compareHashes } from '../compare-hashes.helper'

describe('compareHashesHelper', () => {
    let func: typeof compareHashes

    beforeEach(() => {
        func = compareHashes
    })

    it('should be defined compareHashes helper', () => {
        expect(func).toBeDefined()
    })

    it('should return a match when comparing the value with the hash', async () => {
        const value = 'hash'
        const hash = '0EuY9I6Pi8wVxq5awFCAHNbc/UKPtfnmXE4W54BzQPo='

        const isMatch = await func(value, hash)

        expect(isMatch).toEqual(true)
    })

    it('should return mismatch when comparing value with hash', async () => {
        const value = 'hash'
        const hash = '0EuY9I6Pi8wVxq5awFCAHNbc/UKPtfnmXE4W54BzQPo'

        const isMatch = await func(value, hash)

        expect(isMatch).toEqual(false)
    })
})
