import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserImageDto } from './dto/userImage.dto';
import { UserNameDto } from './dto/username.dto';
import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private readonly logger = new Logger(UserController.name);

  // Update user's profile image

  @Patch(':id/profile/image')
  async updateImage(@Body() dto: UserImageDto) {
      this.logger.log(`Updating image for user with ID: ${dto.userId}`);
      try {
          const result = await this.userService.updateImage(dto);
          this.logger.log(`Image updated successfully for user with ID: ${dto.userId}`);
          return result;
      } catch (error) {
          this.logger.error(`Failed to update image for user with ID: ${dto.userId}`, error.stack);
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }

  // Get user details by ID

  @Get(':id/userDetails')
  async getUserDetails(@Param('id') id: string) {
      this.logger.log(`Fetching details for user with ID: ${id}`);
      try {
          const result = await this.userService.getUserDetails(id);
          this.logger.log(`Fetched details successfully for user with ID: ${id}`);
          return result;
      } catch (error) {
          this.logger.error(`Failed to fetch details for user with ID: ${id}`, error.stack);
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
  }

  //update profile name

  @Patch("name")
  async updateProfileName(@Body() dto: UserNameDto) {
    this.logger.log(`Updating profile for user with ID: ${dto.userId}`);
    try {
        const result = await this.userService.updateProfileName(dto);
        this.logger.log(`Profile updated successfully for user with ID: ${dto.userId}`);
        return result;
    } catch (error) {
        this.logger.error(`Failed to update profile for user with ID: ${dto.userId}`, error.stack);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
}



}
