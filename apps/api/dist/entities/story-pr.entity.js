var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let StoryPR = class StoryPR {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], StoryPR.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], StoryPR.prototype, "story_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryPR.prototype, "provider", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryPR.prototype, "repo", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], StoryPR.prototype, "pr_number", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryPR.prototype, "branch", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryPR.prototype, "status", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryPR.prototype, "url", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], StoryPR.prototype, "head_sha", void 0);
__decorate([
    Column({ default: 'main' }),
    __metadata("design:type", String)
], StoryPR.prototype, "base_branch", void 0);
StoryPR = __decorate([
    Entity('story_pull_requests')
], StoryPR);
export { StoryPR };
//# sourceMappingURL=story-pr.entity.js.map