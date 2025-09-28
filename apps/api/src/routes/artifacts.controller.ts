import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryPR } from '../entities/story-pr.entity';

@Controller('pr')
export class ArtifactsController {
  constructor(@InjectRepository(StoryPR) private prRepo: Repository<StoryPR>) {}

  @Post('ingest')
  async ingest(@Body() b: any) {
    // MVP: simple upsert
    let pr = await this.prRepo.findOne({ where: { provider: b.provider, repo: b.repo, pr_number: b.pr_number } });
    if (!pr) pr = this.prRepo.create(b);
    else Object.assign(pr, b);
    await this.prRepo.save(pr);
    return { ok: true };
  }

  @Get('story/:storyId')
  async listByStory(@Param('storyId') storyId: number) {
    return this.prRepo.find({ where: { story_id: Number(storyId) } });
  }
}