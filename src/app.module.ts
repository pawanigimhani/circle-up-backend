import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FeedModule } from './feed/feed.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [PrismaModule, FeedModule, CommentModule, UserModule, AuthModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
