import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from '../entities/artifact.entity';
import { ArtifactVersion } from '../entities/artifact-version.entity';
import { DocsController } from '../routes/docs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact, ArtifactVersion])],
  controllers: [DocsController],
})
export class DocsModule {}