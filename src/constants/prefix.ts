export enum AUTH_ROUTES {
    BASE = 'auth',
    REGISTER = 'register',
    LOGIN = 'login',
}

export enum MARKDOWN_ROUTES {
    BASE = 'markdowns',
    CREATE = '',
    GET_ALL = '',
    DELETE = ':markdownId',
    GET_SINGLE = ':markdownId',
    UPDATE = ':markdownId',
}

export enum MARKDOWN_NOTE_ROUTES {
    BASE = 'markdown-notes',
    CREATE = '',
    UPDATE = ':markdownNoteId',
    DELETE = ':markdownNoteId/delete',
}

export enum MARKDOWN_PHOTO_ROUTES {
    BASE = 'markdown-photos',
    CREATE = '',
    DELETE = ':markdownPhotoId/delete',
}
