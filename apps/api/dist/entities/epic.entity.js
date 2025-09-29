var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Story } from './story.entity';
let Epic = class Epic {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Epic.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Epic.prototype, "public_id", void 0);
__decorate([
    ManyToOne(() => Project, p => p.epics, { onDelete: 'CASCADE' }),
    __metadata("design:type", Project)
], Epic.prototype, "project", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Epic.prototype, "title", void 0);
__decorate([
    Column({ default: 'OPEN' }),
    __metadata("design:type", String)
], Epic.prototype, "status", void 0);
__decorate([
    OneToMany(() => Story, s => s.epic),
    __metadata("design:type", Array)
], Epic.prototype, "stories", void 0);
Epic = __decorate([
    Entity('epics')
], Epic);
export { Epic };
//# sourceMappingURL=epic.entity.js.map