import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('github-installations')
export class GitHubInstallationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const results = await this.prisma.github_installations.findMany({
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            public_id: true,
            repo_url: true
          }
        }
      }
    })

    // Convert BigInt to string for JSON serialization
    return results.map(result => ({
      ...result,
      installation_id: result.installation_id.toString()
    }))
  }

  @Post()
  async create(@Body() body: {
    installation_id: string | number
    account_login: string
    account_type: 'User' | 'Organization'
    permissions?: Record<string, any>
    events?: string[]
  }) {
    const result = await this.prisma.github_installations.create({
      data: {
        installation_id: BigInt(body.installation_id),
        account_login: body.account_login,
        account_type: body.account_type,
        permissions: body.permissions || {},
        events: body.events || []
      }
    })

    // Convert BigInt to string for JSON serialization
    return {
      ...result,
      installation_id: result.installation_id.toString()
    }
  }

  @Get(':installation_id')
  async get(@Param('installation_id') installation_id: string) {
    const result = await this.prisma.github_installations.findUnique({
      where: { installation_id: BigInt(installation_id) },
      include: {
        projects: true
      }
    })

    if (!result) return null

    // Convert BigInt to string for JSON serialization
    return {
      ...result,
      installation_id: result.installation_id.toString()
    }
  }

  @Delete(':installation_id')
  delete(@Param('installation_id') installation_id: string) {
    return this.prisma.github_installations.delete({
      where: { installation_id: BigInt(installation_id) }
    })
  }
}