import { Transform } from 'class-transformer'
import { IsDefined, IsEmail, Matches } from 'class-validator'
import { PasswordRegExp } from '../../../../shared/regexps/password.regexp'

export class AuthDTO {
    @Transform(({ value }) => value.toLowerCase())
    @IsDefined()
    @IsEmail()
    email: string

    @IsDefined()
    @Matches(PasswordRegExp, {
        message:
            'The password must be at least 8 characters long and contain at least one special character and a number and no spaces',
    })
    password: string
}
