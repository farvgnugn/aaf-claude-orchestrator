import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from '../entities/artifact.entity';
import { ArtifactVersion } from '../entities/artifact-version.entity';
import { StoryPR } from '../entities/story-pr.entity';
import { ArtifactsController } from '../routes/artifacts.controller';
import { GithubWebhookController } from '../routes/github-webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact, ArtifactVersion, StoryPR])],
  controllers: [ArtifactsController, GithubWebhookController],
})
export class ArtifactsModule {}
