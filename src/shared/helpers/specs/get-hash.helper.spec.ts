import { getHash } from '../get-hash.helper'

describe('getHashHelper', () => {
    let func: typeof getHash

    beforeEach(() => {
        func = getHash
    })

    it('should be defined getHash helper', () => {
        expect(func).toBeDefined()
    })

    it('should return a valid hash for the value', async () => {
        const value = 'hash'
        const expectedHash = '0EuY9I6Pi8wVxq5awFCAHNbc/UKPtfnmXE4W54BzQPo='

        const hash = await func(value)

        expect(hash).toEqual(expectedHash)
    })
})
