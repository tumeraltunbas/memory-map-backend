import { Request } from 'express';
import { User } from './user';
import { Markdown } from './markdown';

export interface CustomRequest extends Request {
    user: User;
    markdown: Markdown;
}
