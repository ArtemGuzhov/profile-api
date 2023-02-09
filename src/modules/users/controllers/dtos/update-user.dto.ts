import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDTO {
    @IsOptional()
    @IsNotEmpty()
    name: string

    @IsOptional()
    @IsNotEmpty()
    nickname: string

    @IsOptional()
    @IsNotEmpty()
    description: string
}
