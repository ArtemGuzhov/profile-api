import { ErrorsMessagesEnum } from '../error-messages.enum'

describe('ErrorsEnum', () => {
    let testedEnum: typeof ErrorsMessagesEnum

    beforeEach(() => {
        testedEnum = ErrorsMessagesEnum
    })

    it('compliance check ErrorsMessagesEnum', () => {
        expect(ErrorsMessagesEnum.USER_WITH_THIS_EMAIL_ALREADY_EXISTS).toEqual(
            'User with this email already exists',
        )
        expect(
            ErrorsMessagesEnum.USER_WITH_THIS_NICKNAME_ALREADY_EXISTS,
        ).toEqual('User with this nickname already exists')
        expect(ErrorsMessagesEnum.USER_MEDIA_SERVICE_NOT_AVAILABLE).toEqual(
            'User media service not available',
        )
        expect(ErrorsMessagesEnum.FILE_TYPE_NOT_FOUND).toEqual(
            'File type is not found',
        )
        expect(ErrorsMessagesEnum.USER_NOT_FOUND).toEqual('User is not found')
    })
})
