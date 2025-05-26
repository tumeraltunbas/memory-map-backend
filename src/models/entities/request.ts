import { Request } from 'express';
import { User } from './user';
import { Markdown } from './markdown';
import { MarkdownNote } from './markdown-note';
import { MarkdownPhoto } from './markdown-photo';

export interface CustomRequest extends Request {
    user: User;
    markdown: Markdown;
    markdownNote: MarkdownNote;
    markdownPhoto: MarkdownPhoto;
}
