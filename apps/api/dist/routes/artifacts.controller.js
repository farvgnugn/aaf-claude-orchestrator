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
var _a;
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryPR } from '../entities/story-pr.entity';
let ArtifactsController = class ArtifactsController {
    constructor(prRepo) {
        this.prRepo = prRepo;
    }
    async ingest(b) {
        // MVP: simple upsert
        let pr = await this.prRepo.findOne({ where: { provider: b.provider, repo: b.repo, pr_number: b.pr_number } });
        if (!pr)
            pr = this.prRepo.create(b);
        else
            Object.assign(pr, b);
        await this.prRepo.save(pr);
        return { ok: true };
    }
    async listByStory(storyId) {
        return this.prRepo.find({ where: { story_id: Number(storyId) } });
    }
};
__decorate([
    Post('ingest'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArtifactsController.prototype, "ingest", null);
__decorate([
    Get('story/:storyId'),
    __param(0, Param('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArtifactsController.prototype, "listByStory", null);
ArtifactsController = __decorate([
    Controller('pr'),
    __param(0, InjectRepository(StoryPR)),
    __metadata("design:paramtypes", [typeof (_a = typeof Repository !== "undefined" && Repository) === "function" ? _a : Object])
], ArtifactsController);
export { ArtifactsController };
//# sourceMappingURL=artifacts.controller.js.map