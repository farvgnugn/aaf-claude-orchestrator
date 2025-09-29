import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { randomUUID } from 'crypto'

@Controller('artifacts')
export class DocsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async upsert(@Body() body: any) {
    let art = await this.prisma.artifacts.findFirst({ where: { project_id: body.projectId, scope_kind: body.scopeKind, scope_id: body.scopeId, kind: body.kind } })
    if (!art) {
      art = await this.prisma.artifacts.create({ data: { public_id: randomUUID(), project_id: body.projectId, scope_kind: body.scopeKind, scope_id: body.scopeId, kind: body.kind, title: body.title || body.kind, current_version_no: 0 } })
    }
    return { ok: true, artifact: art }
  }

  @Post(':artifactId/versions')
  async addVersion(@Param('artifactId') artifactId: string, @Body() body: any) {
    const art = await this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } })
    if (!art) return { error: 'artifact not found' }
    const next = (art.current_version_no ?? 0) + 1
    const ver = await this.prisma.artifact_versions.create({ data: { artifact_id: art.id, version_no: next, content_md: body.content_md, content_json: body.content_json, author_type: body.author_type || 'user', author_ref: body.author_ref || 'user:admin', notes: body.notes } })
    await this.prisma.artifacts.update({ where: { id: art.id }, data: { current_version_no: next } })
    return { ok: true, version: ver }
  }

  @Get(':artifactId/versions')
  listVersions(@Param('artifactId') artifactId: string) {
    return this.prisma.artifact_versions.findMany({ where: { artifact_id: Number(artifactId) }, orderBy: { version_no: 'asc' } })
  }

  @Get(':artifactId')
  getArtifact(@Param('artifactId') artifactId: string) {
    return this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } })
  }
}
