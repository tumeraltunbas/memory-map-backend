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
    photos: string[];
    notes: string[];
    createdAt: Date;
    updatedAt: Date;
}
