import { Injectable } from '@nestjs/common';
import { GetProfileReqDto } from '../../models/dto/req/user';
import { GetProfileResDto } from '../../models/dto/res/user';
import { Logger } from '../../infrastructure/logger/logger.service';
import { Markdown, Point } from '../../models/entities/markdown';
import { MarkdownService } from '../markdown/markdown.service';
import { ProcessFailureError } from '../../infrastructure/error/error';
import { ConfigService } from '@nestjs/config';
import { MapboxConfig } from '../../config/configuration';
import { CONFIGURATION_KEYS } from '../../constants/configuration';

@Injectable()
export class UserOrchestration {
    private readonly mapboxConfig: MapboxConfig;
    constructor(
        private readonly logger: Logger,
        private readonly markdownService: MarkdownService,
        private readonly configService: ConfigService,
    ) {
        this.mapboxConfig = this.configService.get(CONFIGURATION_KEYS.mapbox);
    }

    async getProfile(
        getProfileReqDto: GetProfileReqDto,
    ): Promise<GetProfileResDto> {
        const user = getProfileReqDto.user;

        let userMarkdowns: Markdown[] = [];

        try {
            userMarkdowns = await this.markdownService.getMarkdowns(user.id);
        } catch (error) {
            this.logger.error(
                'UserOrchestration - getProfile - getUserMarkdowns',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        const markdownCoordinates: Point[] = userMarkdowns.map(
            (markdown) => markdown.geoLocation as unknown as Point,
        );

        const promises = [];

        for (const coordinate of markdownCoordinates) {
            const url =
                this.mapboxConfig.reverseGeocodeUrl +
                `?longitude=${coordinate.x}&latitude=${coordinate.y}&access_token=${this.mapboxConfig.accessToken}`;

            promises.push(fetch(url));
        }

        let responses: Response[] = [];

        try {
            responses = await Promise.all(promises);
        } catch (error) {
            this.logger.error(
                'UserOrchestration - getProfile - reverseGeocode',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const countries = new Set<string>();
        const cities = new Set<string>();

        for (const response of responses) {
            let data = null;
            try {
                data = await response.json();
            } catch (error) {
                this.logger.error('UserOrchestration - getProfile - json', {
                    error,
                });
                continue;
            }

            const countryFeature = data?.features?.find(
                (result) => result?.properties?.feature_type === 'country',
            );
            const cityFeature = data?.features?.find(
                (result) => result?.properties?.feature_type === 'region',
            );

            if (!countryFeature || !cityFeature) {
                continue;
            }

            countries.add(countryFeature.properties.name);
            cities.add(cityFeature.properties.name);
        }

        const getProfileResDto: GetProfileResDto = {
            user: {
                userId: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
            totalMarkdownCount: userMarkdowns.length,
            totalCountryCount: countries.size,
            totalCityCount: cities.size,
        };

        return getProfileResDto;
    }
}
