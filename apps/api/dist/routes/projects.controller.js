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
import { randomUUID } from 'crypto';
let ProjectsController = class ProjectsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        return this.prisma.projects.findMany();
    }
    async create(body) {
        return this.prisma.projects.create({
            data: { name: body.name, public_id: randomUUID(), repo_ready: false }
        });
    }
    async bindRepo(id, body) {
        const p = await this.prisma.projects.update({
            where: { id: Number(id) },
            data: {
                repo_provider: body.repoProvider,
                repo_url: body.repoUrl,
                repo_default_branch: body.defaultBranch || 'main',
                workspace_root: body.workspaceRoot,
            }
        });
        return { ok: true, project: p };
    }
    async bootstrap(id) {
        await this.prisma.projects.update({ where: { id: Number(id) }, data: { repo_ready: true } });
        return { ok: true };
    }
    async get(id) {
        return this.prisma.projects.findUnique({ where: { id: Number(id) } });
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "list", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    Post(':id/repo/bind'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "bindRepo", null);
__decorate([
    Post(':id/repo/bootstrap'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "bootstrap", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "get", null);
ProjectsController = __decorate([
    Controller('projects'),
    __metadata("design:paramtypes", [PrismaService])
], ProjectsController);
export { ProjectsController };
//# sourceMappingURL=projects.controller.js.map