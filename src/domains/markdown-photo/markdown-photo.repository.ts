import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MarkdownPhoto } from "../../models/entities/markdown-photo";
import { Repository } from "typeorm";

@Injectable()
export class MarkdownPhotoRepository {
    constructor(
        @InjectRepository(MarkdownPhoto)
        private readonly markdownPhotoRepository: Repository<MarkdownPhoto>,
    ) {}
}