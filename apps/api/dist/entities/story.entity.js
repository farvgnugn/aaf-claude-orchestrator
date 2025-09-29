var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Epic } from './epic.entity';
let Story = class Story {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Story.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Story.prototype, "public_id", void 0);
__decorate([
    ManyToOne(() => Epic, e => e.stories, { onDelete: 'CASCADE' }),
    __metadata("design:type", Epic)
], Story.prototype, "epic", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Story.prototype, "title", void 0);
__decorate([
    Column({ default: 'DRAFT' }),
    __metadata("design:type", String)
], Story.prototype, "status", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Story.prototype, "size", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Story.prototype, "risk", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Story.prototype, "dependencies_met", void 0);
Story = __decorate([
    Entity('user_stories')
], Story);
export { Story };
//# sourceMappingURL=story.entity.js.map