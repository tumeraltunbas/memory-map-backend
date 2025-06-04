import {
    ArrayMaxSize,
    ArrayMinSize,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { User } from '../../entities/user';
import { Markdown } from '../../entities/markdown';

export class CreateMarkdownReqDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    coordinates: number[];

    user: User;
}

export class GetMarkdownsReqDto {
    user: User;
}

export class DeleteMarkdownReqDto {
    user: User;
    markdown: Markdown;
}

export class GetMarkdownReqDto {
    markdownId: string;
    user: User;
}

export class UpdateMarkdownReqDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    user: User;
    markdown: Markdown;
}
