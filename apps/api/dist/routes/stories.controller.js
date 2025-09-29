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
exports.StoriesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const crypto_1 = require("crypto");
let StoriesController = class StoriesController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        const epic = await this.prisma.epics.findUnique({ where: { id: Number(body.epicId) } });
        if (!epic)
            return { error: 'epic not found' };
        return this.prisma.user_stories.create({ data: { public_id: (0, crypto_1.randomUUID)(), epic_id: epic.id, title: body.title, status: 'DRAFT' } });
    }
    list(epicId) {
        if (epicId)
            return this.prisma.user_stories.findMany({ where: { epic_id: Number(epicId) } });
        return this.prisma.user_stories.findMany();
    }
    async poReview(id) {
        const s = await this.prisma.user_stories.findUnique({ where: { id: Number(id) } });
        if (!s)
            return { error: 'not found' };
        await this.prisma.story_approvals.create({ data: { story_public_id: s.public_id, stage: 'PO', decision: 'APPROVE', rubric_json: { goalClear: true, atomicScope: true, acceptanceCriteria: true, dataContractsLinked: true, dependenciesResolved: true, nonFunctionalNoted: true, ownerNamed: true, rollbackPlan: true }, notes: 'MVP auto-approve', decided_by: 'subagent:po' } });
        await this.prisma.user_stories.update({ where: { id: s.id }, data: { status: 'APPROVED', dependencies_met: true } });
        return { ok: true, story: await this.prisma.user_stories.findUnique({ where: { id: s.id } }) };
    }
};
exports.StoriesController = StoriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('epicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoriesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/request-po-review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "poReview", null);
exports.StoriesController = StoriesController = __decorate([
    (0, common_1.Controller)('stories'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoriesController);
//# sourceMappingURL=stories.controller.js.map