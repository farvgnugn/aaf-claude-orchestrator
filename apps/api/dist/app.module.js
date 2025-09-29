var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectsController } from './routes/projects.controller';
import { DocsController } from './routes/docs.controller';
import { StoriesController } from './routes/stories.controller';
import { AgentsController } from './routes/agents.controller';
import { ArtifactsController } from './routes/artifacts.controller';
import { GithubWebhookController } from './routes/github-webhook.controller';
import { PrismaService } from './prisma.service';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [ConfigModule.forRoot({ isGlobal: true })],
        controllers: [ProjectsController, DocsController, StoriesController, AgentsController, ArtifactsController, GithubWebhookController],
        providers: [PrismaService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map