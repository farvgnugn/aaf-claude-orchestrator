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
let DocsController = class DocsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(body) {
        // emulate unique composite with findFirst + create
        let art = await this.prisma.artifacts.findFirst({
            where: {
                project_id: body.projectId,
                scope_kind: body.scopeKind,
                scope_id: body.scopeId,
                kind: body.kind
            }
        });
        if (!art) {
            art = await this.prisma.artifacts.create({
                data: {
                    public_id: randomUUID(),
                    project_id: body.projectId,
                    scope_kind: body.scopeKind,
                    scope_id: body.scopeId,
                    kind: body.kind,
                    title: body.title || body.kind,
                    current_version_no: 0
                }
            });
        }
        return { ok: true, artifact: art };
    }
    async addVersion(artifactId, body) {
        const art = await this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } });
        if (!art)
            return { error: 'artifact not found' };
        const next = (art.current_version_no ?? 0) + 1;
        const ver = await this.prisma.artifact_versions.create({
            data: {
                artifact_id: art.id,
                version_no: next,
                content_md: body.content_md,
                content_json: body.content_json,
                author_type: body.author_type || 'user',
                author_ref: body.author_ref || 'user:admin',
                notes: body.notes
            }
        });
        await this.prisma.artifacts.update({ where: { id: art.id }, data: { current_version_no: next } });
        return { ok: true, version: ver };
    }
    async listVersions(artifactId) {
        return this.prisma.artifact_versions.findMany({
            where: { artifact_id: Number(artifactId) },
            orderBy: { version_no: 'asc' }
        });
    }
    async getArtifact(artifactId) {
        return this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } });
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "upsert", null);
__decorate([
    Post(':artifactId/versions'),
    __param(0, Param('artifactId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "addVersion", null);
__decorate([
    Get(':artifactId/versions'),
    __param(0, Param('artifactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "listVersions", null);
__decorate([
    Get(':artifactId'),
    __param(0, Param('artifactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "getArtifact", null);
DocsController = __decorate([
    Controller('artifacts'),
    __metadata("design:paramtypes", [PrismaService])
], DocsController);
export { DocsController };
//# sourceMappingURL=docs.controller.js.map