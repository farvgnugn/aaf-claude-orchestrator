import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entities/story.entity';
import { Epic } from '../entities/epic.entity';
import { StoryApproval } from '../entities/story-approval.entity';
import { StoriesController } from '../routes/stories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Epic, StoryApproval])],
  controllers: [StoriesController],
})
export class StoriesModule {}