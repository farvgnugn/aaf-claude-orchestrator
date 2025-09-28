import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('agents')
export class AgentsController {
  constructor(private prisma: PrismaService) {}

  @Get(':projectId')
  async list(@Param('projectId') projectId: string) {
    return this.prisma.subagent_index.findMany({ where: { project_id: Number(projectId) } });
  }

  @Post(':projectId/index')
  async index(@Param('projectId') projectId: string, @Body() body: { agents: {name:string, file_path:string, sha256:string}[] }) {
    for (const a of body.agents) {
      const existing = await this.prisma.subagent_index.findFirst({ where: { project_id: Number(projectId), name: a.name } });
      if (existing) {
        await this.prisma.subagent_index.update({ where: { id: existing.id }, data: { file_path: a.file_path, sha256: a.sha256 } });
      } else {
        await this.prisma.subagent_index.create({ data: { project_id: Number(projectId), name: a.name, file_path: a.file_path, sha256: a.sha256, enabled: true } });
      }
    }
    return { ok: true };
  }

  @Post(':projectId/policy')
  async setPolicy(@Param('projectId') projectId: string, @Body() body: any) {
    const existing = await this.prisma.subagent_policy.findFirst({ where: { project_id: Number(projectId), agent_name: body.agent_name } });
    if (existing) {
      const updated = await this.prisma.subagent_policy.update({
        where: { id: existing.id },
        data: {
          max_tokens_per_run: body.max_tokens_per_run ?? null,
          allowed_tools: Array.isArray(body.allowed_tools) ? body.allowed_tools.join(',') : null,
          may_bypass_permissions: !!body.may_bypass_permissions
        }
      });
      return { ok: true, policy: updated };
    } else {
      const created = await this.prisma.subagent_policy.create({
        data: {
          project_id: Number(projectId),
          agent_name: body.agent_name,
          max_tokens_per_run: body.max_tokens_per_run ?? null,
          allowed_tools: Array.isArray(body.allowed_tools) ? body.allowed_tools.join(',') : null,
          may_bypass_permissions: !!body.may_bypass_permissions
        }
      });
      return { ok: true, policy: created };
    }
  }
}
