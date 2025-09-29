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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto_1 = require("crypto");
let ProjectsController = class ProjectsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() { return this.prisma.projects.findMany(); }
    create(body) {
        return this.prisma.projects.create({ data: { name: body.name, public_id: (0, crypto_1.randomUUID)(), repo_ready: false } });
    }
    async bindRepo(id, body) {
        // Parse repository URL to extract owner and name
        let repo_owner = null;
        let repo_name = null;
        if (body.repoUrl) {
            const match = body.repoUrl.match(/github\.com\/([^\/]+)\/([^\/#]+)/);
            if (match) {
                repo_owner = match[1];
                repo_name = match[2];
            }
            else {
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
        });
        return { ok: true, project: p };
    }
    async bootstrap(id) {
        await this.prisma.projects.update({ where: { id: Number(id) }, data: { repo_ready: true } });
        return { ok: true };
    }
    get(id) { return this.prisma.projects.findUnique({ where: { id: Number(id) } }); }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/repo/bind'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "bindRepo", null);
__decorate([
    (0, common_1.Post)(':id/repo/bootstrap'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "get", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map