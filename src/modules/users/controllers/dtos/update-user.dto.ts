import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDTO {
    @Transform(({ value }) => value.toLowerCase())
    @IsOptional()
    @IsNotEmpty()
    name: string

    @Transform(({ value }) => value.toLowerCase())
    @IsOptional()
    @IsNotEmpty()
    nickname: string

    @IsOptional()
    @IsNotEmpty()
    description: string
}
