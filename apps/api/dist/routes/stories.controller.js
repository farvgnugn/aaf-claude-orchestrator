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
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
let StoriesController = class StoriesController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        const epic = await this.prisma.epics.findUnique({ where: { id: Number(body.epicId) } });
        if (!epic)
            return { error: 'epic not found' };
        const s = await this.prisma.user_stories.create({
            data: {
                public_id: randomUUID(),
                epic_id: epic.id,
                title: body.title,
                status: 'DRAFT'
            }
        });
        return s;
    }
    async list(epicId) {
        if (epicId) {
            return this.prisma.user_stories.findMany({ where: { epic_id: Number(epicId) } });
        }
        return this.prisma.user_stories.findMany();
    }
    async poReview(id) {
        const s = await this.prisma.user_stories.findUnique({ where: { id: Number(id) } });
        if (!s)
            return { error: 'not found' };
        // Simulate PO approval
        await this.prisma.story_approvals.create({
            data: {
                story_public_id: s.public_id,
                stage: 'PO',
                decision: 'APPROVE',
                rubric_json: { goalClear: true, atomicScope: true, acceptanceCriteria: true, dataContractsLinked: true, dependenciesResolved: true, nonFunctionalNoted: true, ownerNamed: true, rollbackPlan: true },
                notes: 'MVP auto-approve',
                decided_by: 'subagent:po'
            }
        });
        await this.prisma.user_stories.update({
            where: { id: s.id },
            data: { status: 'APPROVED', dependencies_met: true }
        });
        const updated = await this.prisma.user_stories.findUnique({ where: { id: s.id } });
        return { ok: true, story: updated };
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('epicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "list", null);
__decorate([
    Post(':id/request-po-review'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "poReview", null);
StoriesController = __decorate([
    Controller('stories'),
    __metadata("design:paramtypes", [PrismaService])
], StoriesController);
export { StoriesController };
//# sourceMappingURL=stories.controller.js.map