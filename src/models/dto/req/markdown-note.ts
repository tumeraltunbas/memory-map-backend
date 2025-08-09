import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Markdown } from '../../entities/markdown';
import { MarkdownNote } from '../../entities/markdown-note';

export class CreateMarkdownNoteReqDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(1500)
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
    @MaxLength(1500)
    text: string;

    markdownNote: MarkdownNote;
}

export class DeleteMarkdownNoteReqDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    markdownNote: MarkdownNote;
}
