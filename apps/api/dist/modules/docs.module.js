var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from '../entities/artifact.entity';
import { ArtifactVersion } from '../entities/artifact-version.entity';
import { DocsController } from '../routes/docs.controller';
let DocsModule = class DocsModule {
};
DocsModule = __decorate([
    Module({
        imports: [TypeOrmModule.forFeature([Artifact, ArtifactVersion])],
        controllers: [DocsController],
    })
], DocsModule);
export { DocsModule };
//# sourceMappingURL=docs.module.js.map