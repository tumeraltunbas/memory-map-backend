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
