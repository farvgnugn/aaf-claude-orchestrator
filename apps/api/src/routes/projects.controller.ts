import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { randomUUID } from 'crypto'

@Controller('projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get() list() { return this.prisma.projects.findMany() }

  @Post()
  create(@Body() body: { name: string }) {
    return this.prisma.projects.create({ data: { name: body.name, public_id: randomUUID(), repo_ready: false } })
  }

  @Post(':id/repo/bind')
  async bindRepo(@Param('id') id: string, @Body() body: any) {
    const p = await this.prisma.projects.update({
      where: { id: Number(id) },
      data: { repo_provider: body.repoProvider, repo_url: body.repoUrl, repo_default_branch: body.defaultBranch || 'main', workspace_root: body.workspaceRoot }
    })
    return { ok: true, project: p }
  }

  @Post(':id/repo/bootstrap')
  async bootstrap(@Param('id') id: string) {
    await this.prisma.projects.update({ where: { id: Number(id) }, data: { repo_ready: true } })
    return { ok: true }
  }

  @Get(':id') get(@Param('id') id: string) { return this.prisma.projects.findUnique({ where: { id: Number(id) } }) }
}
