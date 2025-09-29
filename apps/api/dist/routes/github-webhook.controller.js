var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma.service';
function verifySig(secret, payload, signature) {
    if (!secret || !signature)
        return true; // dev mode
    const hmac = createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    try {
        return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
    }
    catch {
        return false;
    }
}
let GithubWebhookController = class GithubWebhookController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handle(body, sig) {
        const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
        const ok = verifySig(secret, JSON.stringify(body), sig);
        if (!ok)
            return { error: 'invalid signature' };
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
            }
            else {
                await this.prisma.story_pull_requests.create({ data });
            }
            return { ok: true };
        }
        return { ok: true, ignored: true };
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('x-hub-signature-256')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GithubWebhookController.prototype, "handle", null);
GithubWebhookController = __decorate([
    Controller('webhooks/github'),
    __metadata("design:paramtypes", [PrismaService])
], GithubWebhookController);
export { GithubWebhookController };
//# sourceMappingURL=github-webhook.controller.js.map