import { IsString } from 'class-validator';

export class UserNameDto {
    @IsString()
    name: string;

    @IsString()
    userId: string;
}