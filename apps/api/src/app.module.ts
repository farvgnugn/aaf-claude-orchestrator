import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './routes/projects.controller';
import { DocsController } from './routes/docs.controller';
import { StoriesController } from './routes/stories.controller';
import { AgentsController } from './routes/agents.controller';
import { ArtifactsController } from './routes/artifacts.controller';
import { GithubWebhookController } from './routes/github-webhook.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProjectsController, DocsController, StoriesController, AgentsController, ArtifactsController, GithubWebhookController],
  providers: [PrismaService],
})
export class AppModule {}
