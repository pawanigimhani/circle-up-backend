import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentService {

  private readonly logger = new Logger(CommentService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  create(createCommentDto: CommentDto) {
    this.logger.log(`Creating comment for feed ID: ${createCommentDto.feedId}`);
    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        userId: createCommentDto.userId,
        feedId: createCommentDto.feedId,
      },
    });
  }
}
