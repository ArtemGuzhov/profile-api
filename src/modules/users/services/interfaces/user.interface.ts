import { ImgFile } from './img-file.interface'

export interface User {
    id: string
    name: string
    email: string
    nickname: string
    avatar?: ImgFile
    header?: ImgFile
}
