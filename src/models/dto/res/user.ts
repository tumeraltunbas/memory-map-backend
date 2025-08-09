export class GetUserResDto {
    userId: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class GetProfileResDto {
    user: {
        userId: string;
        email: string;
        createdAt: Date;
    };
    totalMarkdownCount: number;
    totalCountryCount: number;
    totalCityCount: number;
}
