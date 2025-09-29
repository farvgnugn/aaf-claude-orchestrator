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
exports.ArtifactsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ArtifactsController = class ArtifactsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ingest(b) {
        const existing = await this.prisma.story_pull_requests.findFirst({ where: { provider: b.provider, repo: b.repo, pr_number: b.pr_number } });
        if (existing)
            await this.prisma.story_pull_requests.update({ where: { id: existing.id }, data: b });
        else
            await this.prisma.story_pull_requests.create({ data: b });
        return { ok: true };
    }
    listByStory(storyId) {
        return this.prisma.story_pull_requests.findMany({ where: { story_id: Number(storyId) } });
    }
};
exports.ArtifactsController = ArtifactsController;
__decorate([
    (0, common_1.Post)('ingest'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArtifactsController.prototype, "ingest", null);
__decorate([
    (0, common_1.Get)('story/:storyId'),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArtifactsController.prototype, "listByStory", null);
exports.ArtifactsController = ArtifactsController = __decorate([
    (0, common_1.Controller)('pr'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArtifactsController);
//# sourceMappingURL=artifacts.controller.js.map