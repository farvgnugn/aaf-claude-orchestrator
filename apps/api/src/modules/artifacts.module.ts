import { Module } from '@nestjs/common';
import { ArtifactsController } from '../routes/artifacts.controller';
import { GithubWebhookController } from '../routes/github-webhook.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ArtifactsController, GithubWebhookController],
  providers: [PrismaService],
})
export class ArtifactsModule {}
