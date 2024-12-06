import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedDto } from '../dto/feed.dto';
import { FeedLikeDto } from '../dto/feedLike.dto';
import { CaptionDto } from '../dto/caption.dto';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);

  constructor(
    private prisma: PrismaService,
  ) {}

  // ------- feed services ---------

  //Fetches the feed for a specific photographer

  async getFeed(id: string) {
    try {
      this.logger.log(`Fetching feed for photographer ID: ${id}`);

      const feed = await this.prisma.feedImage.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          imageUrl: true,
          likeCount: true,
          saveCount: true,
          caption: true,
          userId: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          likedUserIds: true,
          savedUserIds: true,
          comments: {
            select: {
              id: true,
              text: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      this.logger.log(
        `Successfully fetched ${feed.length} feed items for photographer ID: ${id}`,
      );

      return feed;
    } catch (error) {
      this.logger.error(`Failed to fetch feed for photographer ID: ${id}`, error.stack);
      throw error;
    }
}

  //Creates a new feed component.

  async createFeedComponent(dto: FeedDto) {
    try {
      this.logger.log(
        `Creating feed component for photographer ID: ${dto.userId}`,
      );

      const newFeedComponent = await this.prisma.feedImage.create({
        data: {
          imageUrl: dto.image,
          user: {
            connect: {
              id: dto.userId,
            },
          },
        },
      });

      this.logger.log(
        `Successfully created feed component with ID: ${newFeedComponent.id} for photographer ID: ${dto.userId}`,
      );
      return newFeedComponent;
    } catch (error) {
      this.logger.error(
        `Failed to create feed component for photographer ID: ${dto.userId}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to create feed component',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Likes or unlikes a feed image

  async feedLike(dto: FeedLikeDto) {
    try {
      this.logger.log(
        `Processing like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
      );

      // Check if the like already exists
      const existingLike = await this.prisma.feedImage.findFirst({
        where: {
          id: dto.feedId,
          likedUserIds: {
            has: dto.userId,
          },
        },
      });

      // Fetch the feed to get the current like count
      const feed = await this.prisma.feedImage.findUnique({
        where: {
          id: dto.feedId,
        },
        select: {
          id: true,
          likeCount: true,
        },
      });

      if (!feed) {
        this.logger.warn(`Feed ID: ${dto.feedId} not found`);
        throw new Error('Feed not found');
      }

      let likeCount = feed.likeCount;

      if (dto.like) {
        if (!existingLike) {
          // Add the like
          await this.prisma.feedImage.update({
            where: {
              id: dto.feedId,
            },
            data: {
              likedUserIds: {
                push: dto.userId,
              },
              likes: {
                connect: { id: dto.userId },
              },
            },
          });
          likeCount++;
          this.logger.log(
            `User ID: ${dto.userId} liked feed ID: ${dto.feedId}`,
          );
        }
      } else {
        if (existingLike) {
          // Remove the like
          await this.prisma.feedImage.update({
            where: {
              id: dto.feedId,
            },
            data: {
              likedUserIds: {
                set: existingLike.likedUserIds.filter(
                  (id) => id !== dto.userId,
                ),
              },
            },
          });
          likeCount--;
          await this.prisma.user.update({
            where: { id: dto.userId },
            data: {
              likedFeedImages: {
                disconnect: { id: dto.feedId },
              },
            },
          });
          this.logger.log(
            `User ID: ${dto.userId} unliked feed ID: ${dto.feedId}`,
          );
        }
      }

      // Update the like count
      const updatedFeed = await this.prisma.feedImage.update({
        where: {
          id: dto.feedId,
        },
        data: {
          likeCount: likeCount,
        },
      });

      this.logger.log(
        `Updated like count for feed ID: ${dto.feedId} to ${likeCount}`,
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to process like for feed ID: ${dto.feedId} by user ID: ${dto.userId}`,
        error.stack,
      );
      throw new HttpException('Failed to process like', HttpStatus.BAD_REQUEST);
    }
  }

  //Updates the caption of a feed image

  async updateCaption(dto: CaptionDto) {
    try {
      this.logger.log(`Updating caption for feed ID: ${dto.feedId}`);

      const updatedFeed = await this.prisma.feedImage.update({
        where: {
          id: dto.feedId,
        },
        data: {
          caption: dto.caption,
        },
      });

      this.logger.log(
        `Successfully updated caption for feed ID: ${dto.feedId}`,
      );
      return updatedFeed;
    } catch (error) {
      this.logger.error(
        `Failed to update caption for feed ID: ${dto.feedId}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to update caption',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

