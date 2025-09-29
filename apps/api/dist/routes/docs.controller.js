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
exports.DocsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto_1 = require("crypto");
let DocsController = class DocsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(body) {
        let art = await this.prisma.artifacts.findFirst({ where: { project_id: body.projectId, scope_kind: body.scopeKind, scope_id: body.scopeId, kind: body.kind } });
        if (!art) {
            art = await this.prisma.artifacts.create({ data: { public_id: (0, crypto_1.randomUUID)(), project_id: body.projectId, scope_kind: body.scopeKind, scope_id: body.scopeId, kind: body.kind, title: body.title || body.kind, current_version_no: 0 } });
        }
        return { ok: true, artifact: art };
    }
    async addVersion(artifactId, body) {
        const art = await this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } });
        if (!art)
            return { error: 'artifact not found' };
        const next = (art.current_version_no ?? 0) + 1;
        const ver = await this.prisma.artifact_versions.create({ data: { artifact_id: art.id, version_no: next, content_md: body.content_md, content_json: body.content_json, author_type: body.author_type || 'user', author_ref: body.author_ref || 'user:admin', notes: body.notes } });
        await this.prisma.artifacts.update({ where: { id: art.id }, data: { current_version_no: next } });
        return { ok: true, version: ver };
    }
    listVersions(artifactId) {
        return this.prisma.artifact_versions.findMany({ where: { artifact_id: Number(artifactId) }, orderBy: { version_no: 'asc' } });
    }
    getArtifact(artifactId) {
        return this.prisma.artifacts.findUnique({ where: { id: Number(artifactId) } });
    }
};
exports.DocsController = DocsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)(':artifactId/versions'),
    __param(0, (0, common_1.Param)('artifactId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "addVersion", null);
__decorate([
    (0, common_1.Get)(':artifactId/versions'),
    __param(0, (0, common_1.Param)('artifactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocsController.prototype, "listVersions", null);
__decorate([
    (0, common_1.Get)(':artifactId'),
    __param(0, (0, common_1.Param)('artifactId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocsController.prototype, "getArtifact", null);
exports.DocsController = DocsController = __decorate([
    (0, common_1.Controller)('artifacts'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocsController);
//# sourceMappingURL=docs.controller.js.map