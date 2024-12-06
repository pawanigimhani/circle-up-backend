import { IsBoolean, IsString } from "class-validator";

export class CommentDto {
    @IsString()
    feedId: string;

    @IsString()
    userId: string;

    @IsBoolean()
    text: string;
}