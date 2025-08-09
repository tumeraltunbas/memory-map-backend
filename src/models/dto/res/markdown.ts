import { Point } from '../../entities/markdown';

export interface CreateMarkdownResDto {
    markdownId: string;
}

export interface GetMarkdownsResDto {
    markdowns: {
        markdownId: string;
        title: string;
        geoLocation: Point;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export interface GetMarkdownResDto {
    markdownId: string;
    title: string;
    geoLocation: Point;
    photos: MarkdownPhotoResDto[];
    notes: MarkdownNoteResDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MarkdownNoteResDto {
    id: string;
    text: string;
}

export interface MarkdownPhotoResDto {
    id: string;
    url: string;
}
