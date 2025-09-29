"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactsModule = void 0;
const common_1 = require("@nestjs/common");
const artifacts_controller_1 = require("../routes/artifacts.controller");
const github_webhook_controller_1 = require("../routes/github-webhook.controller");
const prisma_service_1 = require("../prisma.service");
let ArtifactsModule = class ArtifactsModule {
};
exports.ArtifactsModule = ArtifactsModule;
exports.ArtifactsModule = ArtifactsModule = __decorate([
    (0, common_1.Module)({
        controllers: [artifacts_controller_1.ArtifactsController, github_webhook_controller_1.GithubWebhookController],
        providers: [prisma_service_1.PrismaService],
    })
], ArtifactsModule);
//# sourceMappingURL=artifacts.module.js.map