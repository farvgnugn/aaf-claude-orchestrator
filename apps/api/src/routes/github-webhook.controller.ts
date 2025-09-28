import { Body, Controller, Headers, Post } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma.service';

function verifySig(secret: string, payload: string, signature?: string) {
  if (!secret || !signature) return true; // dev mode
  const hmac = createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

@Controller('webhooks/github')
export class GithubWebhookController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: any, @Headers('x-hub-signature-256') sig?: string) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
    const ok = verifySig(secret, JSON.stringify(body), sig);
    if (!ok) return { error: 'invalid signature' };

    if (body.pull_request) {
      const pr = body.pull_request;
      const repoFull = body.repository?.full_name || 'unknown/repo';
      const status = pr.merged ? 'MERGED' : (pr.state || 'OPEN').toUpperCase();
      const storyId = Number(body.story_id || 0);
      const data = {
        story_id: storyId,
        provider: 'github',
        repo: repoFull,
        pr_number: pr.number,
        branch: pr.head?.ref || '',
        status,
        url: pr.html_url,
        head_sha: pr.head?.sha || null,
        base_branch: pr.base?.ref || 'main'
      };
      const existing = await this.prisma.story_pull_requests.findFirst({ where: { provider: 'github', repo: repoFull, pr_number: pr.number } });
      if (existing) {
        await this.prisma.story_pull_requests.update({ where: { id: existing.id }, data });
      } else {
        await this.prisma.story_pull_requests.create({ data });
      }
      return { ok: true };
    }
    return { ok: true, ignored: true };
  }
}
