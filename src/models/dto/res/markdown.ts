export interface CreateMarkdownResDto {
    markdownId: string;
}

export interface GetMarkdownsResDto {
    markdowns: {
        markdownId: string;
        title: string;
        geoLocation: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export interface GetMarkdownResDto {
    markdownId: string;
    title: string;
    geoLocation: string;
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
