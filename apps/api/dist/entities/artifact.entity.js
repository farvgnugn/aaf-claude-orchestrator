var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArtifactVersion } from './artifact-version.entity';
let Artifact = class Artifact {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Artifact.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Artifact.prototype, "public_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Artifact.prototype, "project_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Artifact.prototype, "scope_kind", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Artifact.prototype, "scope_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Artifact.prototype, "kind", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Artifact.prototype, "title", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Artifact.prototype, "current_version_no", void 0);
__decorate([
    OneToMany(() => ArtifactVersion, v => v.artifact),
    __metadata("design:type", Array)
], Artifact.prototype, "versions", void 0);
Artifact = __decorate([
    Entity('artifacts')
], Artifact);
export { Artifact };
//# sourceMappingURL=artifact.entity.js.map