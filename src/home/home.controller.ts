import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { Logger } from '@nestjs/common';

@Controller('home')
export class HomeController {

  constructor(private readonly homeService: HomeService) {}
  private readonly logger = new Logger(HomeController.name);

  // ------- home controllers ---------

  //Fetches the home feed regarding to created date and amount of likes

  @Get('posts')
  async getAllFeedImages() {

    this.logger.log('Received request to fetch all feed images.');

    const feedImages = await this.homeService.getAllFeedImages();

    this.logger.log(
      `Successfully fetched ${feedImages.length} feed images.`,
    ); 

    return feedImages;
  }

}
