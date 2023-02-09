import { Transform } from 'class-transformer'
import { IsDefined, IsInt, Min } from 'class-validator'

export class GetUsersDTO {
    @Transform(({ value }) => Number(value))
    @IsDefined()
    @IsInt({ message: 'Page number must be an integer' })
    @Min(1)
    page: number

    @Transform(({ value }) => Number(value))
    @IsDefined()
    @IsInt({ message: 'Limit must be an number' })
    @Min(1)
    limit: number
}
