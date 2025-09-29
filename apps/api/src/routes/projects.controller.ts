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
    // Parse repository URL to extract owner and name
    let repo_owner = null;
    let repo_name = null;

    if (body.repoUrl) {
      const match = body.repoUrl.match(/github\.com\/([^\/]+)\/([^\/#]+)/);
      if (match) {
        repo_owner = match[1];
        repo_name = match[2];
      } else {
        // Handle owner/repo format
        const parts = body.repoUrl.split('/');
        if (parts.length === 2) {
          repo_owner = parts[0];
          repo_name = parts[1];
        }
      }
    }

    const p = await this.prisma.projects.update({
      where: { id: Number(id) },
      data: {
        repo_provider: body.repoProvider,
        repo_url: body.repoUrl,
        repo_owner,
        repo_name,
        repo_default_branch: body.defaultBranch || 'main',
        workspace_root: body.workspaceRoot,
        github_webhook_secret: body.githubWebhookSecret,
        github_app_installation_id: body.githubAppInstallationId ? BigInt(body.githubAppInstallationId) : null,
        github_token_encrypted: body.githubTokenEncrypted,
        github_token_expires_at: body.githubTokenExpiresAt ? new Date(body.githubTokenExpiresAt) : null
      }
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
