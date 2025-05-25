import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Markdown } from '../../entities/markdown';

export class CreateMarkdownNoteReqDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    text: string;

    markdown: Markdown;
}

export class UpdateMarkdownNoteReqDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    text: string;

    markdownNoteId: string;
}

export class DeleteMarkdownNoteReqDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    markdownNoteId: string;
}
