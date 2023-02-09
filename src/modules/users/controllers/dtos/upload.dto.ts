import { IsEnum, IsDefined } from 'class-validator'
import { FileTypesEnum } from '../../services/enums/file-types.enum'

export class UploadDTO {
    @IsDefined()
    @IsEnum(FileTypesEnum, {
        message: 'Media file type can be: "avatar" or "header"',
    })
    type: FileTypesEnum
}
