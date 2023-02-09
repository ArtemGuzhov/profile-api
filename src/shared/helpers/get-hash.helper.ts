import { createHash } from 'crypto'

export const getHash = async (value: string): Promise<string> => {
    const hash = createHash('sha256').update(value).digest('base64')

    return hash
}
