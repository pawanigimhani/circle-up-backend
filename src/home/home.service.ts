import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';  

@Injectable()
export class HomeService {
 
  constructor(private readonly prisma: PrismaService) {}

  // ------- home services ---------

  //Fetches the home feed regarding to created date and amount of likes

  async getAllFeedImages() {
    return this.prisma.feedImage.findMany({
      select: {
        id: true,
        imageUrl: true,
        likeCount: true,
        caption: true,
        userId: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likedUserIds: true,
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
      orderBy: [
        { createdAt: 'desc' }, // First index: time created
        { likeCount: 'desc' }, // Second index: amount of likes
      ],
    });
  }
}
