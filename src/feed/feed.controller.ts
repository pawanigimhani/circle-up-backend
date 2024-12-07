import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException, HttpStatus, Logger
} from '@nestjs/common';

import { FeedDto } from '../dto/feed.dto';
import { FeedLikeDto } from '../dto/feedLike.dto';
import { CaptionDto } from '../dto/caption.dto';
import { FeedService } from './feed.service';


@Controller('api/')
export class FeedController {

  private readonly logger = new Logger(FeedController.name);

  constructor(private feedService: FeedService) { }

   // ------- feed controllers ---------

   @Get(':id/feed')
   async getFeed(
       @Param('id') id: string
   ) {
       this.logger.log(`Getting feed for user with ID: ${id}`);
       try {
           return await this.feedService.getFeed(id);
       } catch (error) {
           throw new HttpException(`Feed not found for user with ID: ${id}`, HttpStatus.NOT_FOUND);
       }
   }
 
   @Post(':id/feed/createFeed')
   async createFeedComponent(
       @Body() dto: FeedDto
   ) {
       this.logger.log(`Creating feed component for user with ID: ${dto.userId}`);
       try {
           return await this.feedService.createFeedComponent(dto);
       } catch (error) {
           throw new HttpException(`Error creating feed component for user with ID: ${dto.userId}`, HttpStatus.BAD_REQUEST);
       }
   }
 
   @Patch(':id/feed/like')
   async feedLike(
       @Param('id') photographerId: string,
       @Body() dto: FeedLikeDto
   ) {
       this.logger.log(`Liking feed for user with ID: ${photographerId}`);
       try {
           return await this.feedService.feedLike(dto);
       } catch (error) {
           throw new HttpException(`Error liking feed for user with ID: ${photographerId}`, HttpStatus.BAD_REQUEST);
       }
   }

   @Patch(':id/feed/caption')
   async updateCaption(
       @Body() dto: CaptionDto
   ) {
       this.logger.log(`Updating caption for feed with ID: ${dto.feedId}`);
       try {
           return await this.feedService.updateCaption(dto);
       } catch (error) {
           throw new HttpException(`Error updating caption for feed with ID: ${dto.feedId}`, HttpStatus.BAD_REQUEST);
       }
   }
 
}

