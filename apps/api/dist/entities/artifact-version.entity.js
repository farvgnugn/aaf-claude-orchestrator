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
import { Artifact } from './artifact.entity';
let ArtifactVersion = class ArtifactVersion {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArtifactVersion.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Artifact, a => a.versions, { onDelete: 'CASCADE' }),
    __metadata("design:type", Artifact)
], ArtifactVersion.prototype, "artifact", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], ArtifactVersion.prototype, "version_no", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ArtifactVersion.prototype, "content_md", void 0);
__decorate([
    Column({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ArtifactVersion.prototype, "content_json", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ArtifactVersion.prototype, "author_type", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ArtifactVersion.prototype, "author_ref", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ArtifactVersion.prototype, "notes", void 0);
ArtifactVersion = __decorate([
    Entity('artifact_versions')
], ArtifactVersion);
export { ArtifactVersion };
//# sourceMappingURL=artifact-version.entity.js.map