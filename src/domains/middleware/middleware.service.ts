import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { UserToken } from '../../models/entities/user-token';
import { User } from '../../models/entities/user';
import { Markdown } from '../../models/entities/markdown';
import { MarkdownService } from '../markdown/markdown.service';
import { MarkdownNote } from '../../models/entities/markdown-note';
import { MarkdownNoteService } from '../markdown-note/markdown.note.service';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';
import { MarkdownPhotoService } from '../markdown-photo/markdown-photo.service';

@Injectable()
export class MiddlewareService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly markdownService: MarkdownService,
        private readonly markdownNoteService: MarkdownNoteService,
        private readonly markdownPhotoService: MarkdownPhotoService,
    ) {}

    fetchUserTokenByAccessToken(accessToken: string): Promise<UserToken> {
        return this.authService.fetchUserTokenByAccessToken(accessToken);
    }

    async updateUserTokenAccessToken(
        userTokenId: string,
        accessToken: string,
    ): Promise<void> {
        await this.authService.updateUserTokenAccessToken(
            userTokenId,
            accessToken,
        );
    }

    async fetchUserById(userId: string): Promise<User> {
        return this.userService.fetchUserById(userId);
    }

    async getMarkdownById(
        markdownId: string,
        userId: string,
    ): Promise<Markdown> {
        return this.markdownService.getMarkdownById(markdownId, userId);
    }

    async getMarkdownNoteById(
        markdownNoteId: string,
        markdownId: string,
        userId: string,
    ): Promise<MarkdownNote> {
        return this.markdownNoteService.getMarkdownNoteById(
            markdownNoteId,
            markdownId,
            userId,
        );
    }

    async getMarkdownPhotoById(
        markdownPhotoId: string,
        markdownId: string,
        userId: string,
    ): Promise<MarkdownPhoto> {
        return this.markdownPhotoService.getMarkdownPhotoById(
            markdownPhotoId,
            markdownId,
            userId,
        );
    }
}
