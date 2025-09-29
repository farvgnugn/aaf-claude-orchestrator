import { Module } from '@nestjs/common';
import { StoriesController } from '../routes/stories.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [StoriesController],
  providers: [PrismaService],
})
export class StoriesModule {}