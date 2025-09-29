import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('pr')
export class ArtifactsController {
  constructor(private prisma: PrismaService) {}

  @Post('ingest')
  async ingest(@Body() b: any) {
    const existing = await this.prisma.story_pull_requests.findFirst({ where: { provider: b.provider, repo: b.repo, pr_number: b.pr_number } })
    if (existing) await this.prisma.story_pull_requests.update({ where: { id: existing.id }, data: b })
    else await this.prisma.story_pull_requests.create({ data: b })
    return { ok: true }
  }

  @Get('story/:storyId')
  listByStory(@Param('storyId') storyId: string) {
    return this.prisma.story_pull_requests.findMany({ where: { story_id: Number(storyId) } })
  }
}
