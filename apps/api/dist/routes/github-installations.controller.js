"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubInstallationsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let GitHubInstallationsController = class GitHubInstallationsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() {
        return this.prisma.github_installations.findMany({
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        public_id: true,
                        repo_url: true
                    }
                }
            }
        });
    }
    create(body) {
        return this.prisma.github_installations.create({
            data: {
                installation_id: BigInt(body.installation_id),
                account_login: body.account_login,
                account_type: body.account_type,
                permissions: body.permissions || {},
                events: body.events || []
            }
        });
    }
    get(installation_id) {
        return this.prisma.github_installations.findUnique({
            where: { installation_id: BigInt(installation_id) },
            include: {
                projects: true
            }
        });
    }
    delete(installation_id) {
        return this.prisma.github_installations.delete({
            where: { installation_id: BigInt(installation_id) }
        });
    }
};
exports.GitHubInstallationsController = GitHubInstallationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GitHubInstallationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GitHubInstallationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':installation_id'),
    __param(0, (0, common_1.Param)('installation_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GitHubInstallationsController.prototype, "get", null);
__decorate([
    (0, common_1.Delete)(':installation_id'),
    __param(0, (0, common_1.Param)('installation_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GitHubInstallationsController.prototype, "delete", null);
exports.GitHubInstallationsController = GitHubInstallationsController = __decorate([
    (0, common_1.Controller)('github-installations'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GitHubInstallationsController);
//# sourceMappingURL=github-installations.controller.js.map