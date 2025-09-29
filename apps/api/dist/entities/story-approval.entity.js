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
let StoryApproval = class StoryApproval {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], StoryApproval.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryApproval.prototype, "story_public_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryApproval.prototype, "stage", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryApproval.prototype, "decision", void 0);
__decorate([
    Column({ type: 'jsonb' }),
    __metadata("design:type", Object)
], StoryApproval.prototype, "rubric_json", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StoryApproval.prototype, "notes", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], StoryApproval.prototype, "decided_by", void 0);
StoryApproval = __decorate([
    Entity('story_approvals')
], StoryApproval);
export { StoryApproval };
//# sourceMappingURL=story-approval.entity.js.map