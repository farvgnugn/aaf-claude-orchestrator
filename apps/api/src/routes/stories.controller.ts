import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';

@Controller('stories')
export class StoriesController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() body: { epicId: number; title: string }) {
    const epic = await this.prisma.epics.findUnique({ where: { id: Number(body.epicId) } });
    if (!epic) return { error: 'epic not found' };
    const s = await this.prisma.user_stories.create({
      data: {
        public_id: randomUUID(),
        epic_id: epic.id,
        title: body.title,
        status: 'DRAFT'
      }
    });
    return s;
  }

  @Get()
  async list(@Query('epicId') epicId?: string) {
    if (epicId) {
      return this.prisma.user_stories.findMany({ where: { epic_id: Number(epicId) } });
    }
    return this.prisma.user_stories.findMany();
  }

  @Post(':id/request-po-review')
  async poReview(@Param('id') id: string) {
    const s = await this.prisma.user_stories.findUnique({ where: { id: Number(id) } });
    if (!s) return { error: 'not found' };
    // Simulate PO approval
    await this.prisma.story_approvals.create({
      data: {
        story_public_id: s.public_id,
        stage: 'PO',
        decision: 'APPROVE',
        rubric_json: { goalClear: true, atomicScope: true, acceptanceCriteria: true, dataContractsLinked: true, dependenciesResolved: true, nonFunctionalNoted: true, ownerNamed: true, rollbackPlan: true },
        notes: 'MVP auto-approve',
        decided_by: 'subagent:po'
      }
    });
    await this.prisma.user_stories.update({
      where: { id: s.id },
      data: { status: 'APPROVED', dependencies_met: true }
    });
    const updated = await this.prisma.user_stories.findUnique({ where: { id: s.id } });
    return { ok: true, story: updated };
  }
}
