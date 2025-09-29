"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AgentsController = class AgentsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(projectId) {
        return this.prisma.subagent_index.findMany({ where: { project_id: Number(projectId) } });
    }
    async index(projectId, body) {
        for (const a of body.agents) {
            const existing = await this.prisma.subagent_index.findFirst({ where: { project_id: Number(projectId), name: a.name } });
            if (existing)
                await this.prisma.subagent_index.update({ where: { id: existing.id }, data: { file_path: a.file_path, sha256: a.sha256 } });
            else
                await this.prisma.subagent_index.create({ data: { project_id: Number(projectId), name: a.name, file_path: a.file_path, sha256: a.sha256, enabled: true } });
        }
        return { ok: true };
    }
    async setPolicy(projectId, body) {
        const existing = await this.prisma.subagent_policy.findFirst({ where: { project_id: Number(projectId), agent_name: body.agent_name } });
        const data = { max_tokens_per_run: body.max_tokens_per_run ?? null, allowed_tools: Array.isArray(body.allowed_tools) ? body.allowed_tools.join(',') : null, may_bypass_permissions: !!body.may_bypass_permissions };
        if (existing)
            return { ok: true, policy: await this.prisma.subagent_policy.update({ where: { id: existing.id }, data }) };
        return { ok: true, policy: await this.prisma.subagent_policy.create({ data: { project_id: Number(projectId), agent_name: body.agent_name, ...data } }) };
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Get)(':projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':projectId/index'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "index", null);
__decorate([
    (0, common_1.Post)(':projectId/policy'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "setPolicy", null);
exports.AgentsController = AgentsController = __decorate([
    (0, common_1.Controller)('agents'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map