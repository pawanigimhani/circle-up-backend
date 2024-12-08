import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';  
import { UserImageDto } from './dto/userImage.dto';
import { UserNameDto } from './dto/username.dto';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

  // ------- user services ---------

  // Update user's profile image

  async updateImage(dto: UserImageDto) {
    this.logger.log(`Updating image for user with ID: ${dto.userId}`);
    try {
        const result = await this.prisma.user.update({
            where: {
                id: dto.userId,
            },
            data: {
                image: dto.image,
            },
        });
        this.logger.log(`Image updated successfully for client with ID: ${dto.userId}`);
        return result;
    } catch (error) {
        this.logger.error(`Failed to update image for client with ID: ${dto.userId}`, error.stack);
        throw new HttpException('Failed to update image', HttpStatus.BAD_REQUEST);
    }
}

// Get user details by ID

async getUserDetails(id: string) {
    this.logger.log(`Fetching details for user with ID: ${id}`);
    try {
        const result = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                name: true,
                image: true,
                username:true,
            }
        });
        this.logger.log(`Fetched details successfully for user with ID: ${id}`);
        return result;
    } catch (error) {
        this.logger.error(`Failed to fetch details for user with ID: ${id}`, error.stack);
        throw new HttpException('Failed to fetch user details', HttpStatus.NOT_FOUND);
    }
}

// Update user profile naem

async updateProfileName(dto: UserNameDto ) {
    this.logger.log(`Updating profile for user with ID: ${dto.userId}`);
    try {
        const result = await this.prisma.user.update({
            where: {
                id: dto.userId,
            },
            data: {
                name: dto.name,
            },
        });
        this.logger.log(`Profile updated successfully for user with ID: ${dto.userId}`);
        return result;
    } catch (error) {
        this.logger.error(`Failed to update profile for user with ID: ${dto.userId}`, error.stack);
        throw new HttpException('Failed to update profile', HttpStatus.BAD_REQUEST);
    }
}
  
}
