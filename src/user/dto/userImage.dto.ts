import { IsString } from 'class-validator';

export class UserImageDto {
    @IsString()
    image: string;

    @IsString()
    userId: string;
}