import {
    ArrayMaxSize,
    ArrayMinSize,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { User } from '../../entities/user';

export class CreateMarkdownReqDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    coordinates: number[];

    user: User;
}

export class GetMarkdownsReqDto {
    user: User;
}

export class DeleteMarkdownReqDto {
    markdownId: string;
    user: User;
}

export class GetMarkdownReqDto {
    markdownId: string;
    user: User;
}
