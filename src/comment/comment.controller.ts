import { Controller, Post, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from '../dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("/create")
  create(@Body() createCommentDto: CommentDto) {
    return this.commentService.create(createCommentDto);
  }
}
