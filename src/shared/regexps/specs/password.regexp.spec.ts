import { PasswordRegExp } from '../password.regexp'

describe('getHashHelper', () => {
    let passwordRegexp: typeof PasswordRegExp

    beforeEach(() => {
        passwordRegexp = PasswordRegExp
    })

    it('should be defined PasswordRegExps', () => {
        expect(passwordRegexp).toBeDefined()
    })

    it('check correct password RegExp', () => {
        expect(passwordRegexp.test('Pa$$w0rd')).toEqual(true)
        expect(passwordRegexp.test('password')).toEqual(false)
    })
})
