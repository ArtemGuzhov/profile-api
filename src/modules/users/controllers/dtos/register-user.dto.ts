import { Transform } from 'class-transformer'
import { IsEmail, Matches, IsDefined, IsNotEmpty } from 'class-validator'
import { PasswordRegExp } from '../../../../shared/regexps/password.regexp'

export class RegisterUserDTO {
    @Transform(({ value }) => value.toLowerCase())
    @IsDefined()
    @IsEmail()
    email: string

    @Transform(({ value }) => value.toLowerCase())
    @IsDefined()
    @IsNotEmpty({ message: 'Name must not be empty' })
    name: string

    @IsDefined()
    @Matches(PasswordRegExp, {
        message:
            'The password must be at least 8 characters long and contain at least one special character and a number and no spaces',
    })
    password: string
}
