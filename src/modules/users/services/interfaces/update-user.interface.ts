import { ImgFile } from './img-file.interface'

export interface UpdateUser {
    name?: string
    nickname?: string
    description?: string
    avatar?: ImgFile
    header?: ImgFile
    refreshToken?: string
}
