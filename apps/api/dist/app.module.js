"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const projects_controller_1 = require("./routes/projects.controller");
const docs_controller_1 = require("./routes/docs.controller");
const stories_controller_1 = require("./routes/stories.controller");
const agents_controller_1 = require("./routes/agents.controller");
const artifacts_controller_1 = require("./routes/artifacts.controller");
const github_webhook_controller_1 = require("./routes/github-webhook.controller");
const github_installations_controller_1 = require("./routes/github-installations.controller");
const prisma_service_1 = require("./prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
        controllers: [projects_controller_1.ProjectsController, docs_controller_1.DocsController, stories_controller_1.StoriesController, agents_controller_1.AgentsController, artifacts_controller_1.ArtifactsController, github_webhook_controller_1.GithubWebhookController, github_installations_controller_1.GitHubInstallationsController],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map