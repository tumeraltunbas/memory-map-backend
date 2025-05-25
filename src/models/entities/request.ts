import { Request } from 'express';
import { User } from './user';
import { Markdown } from './markdown';
import { MarkdownNote } from './markdown-note';

export interface CustomRequest extends Request {
    user: User;
    markdown: Markdown;
    markdownNote: MarkdownNote;
}
