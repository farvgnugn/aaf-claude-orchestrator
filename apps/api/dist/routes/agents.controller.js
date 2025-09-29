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
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
let AgentsController = class AgentsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(projectId) {
        return this.prisma.subagent_index.findMany({ where: { project_id: Number(projectId) } });
    }
    async index(projectId, body) {
        for (const a of body.agents) {
            const existing = await this.prisma.subagent_index.findFirst({ where: { project_id: Number(projectId), name: a.name } });
            if (existing) {
                await this.prisma.subagent_index.update({ where: { id: existing.id }, data: { file_path: a.file_path, sha256: a.sha256 } });
            }
            else {
                await this.prisma.subagent_index.create({ data: { project_id: Number(projectId), name: a.name, file_path: a.file_path, sha256: a.sha256, enabled: true } });
            }
        }
        return { ok: true };
    }
    async setPolicy(projectId, body) {
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
        }
        else {
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
};
__decorate([
    Get(':projectId'),
    __param(0, Param('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "list", null);
__decorate([
    Post(':projectId/index'),
    __param(0, Param('projectId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "index", null);
__decorate([
    Post(':projectId/policy'),
    __param(0, Param('projectId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "setPolicy", null);
AgentsController = __decorate([
    Controller('agents'),
    __metadata("design:paramtypes", [PrismaService])
], AgentsController);
export { AgentsController };
//# sourceMappingURL=agents.controller.js.map