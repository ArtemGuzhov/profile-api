import { getHash } from './get-hash.helper'

export const compareHashes = async (value: string, hash: string) => {
    const hashValue = await getHash(value)

    return hash === hashValue
}
