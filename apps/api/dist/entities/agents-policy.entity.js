var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let AgentsPolicy = class AgentsPolicy {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AgentsPolicy.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], AgentsPolicy.prototype, "project_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], AgentsPolicy.prototype, "agent_name", void 0);
__decorate([
    Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AgentsPolicy.prototype, "max_tokens_per_run", void 0);
__decorate([
    Column({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], AgentsPolicy.prototype, "allowed_tools", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], AgentsPolicy.prototype, "may_bypass_permissions", void 0);
AgentsPolicy = __decorate([
    Entity('subagent_policy')
], AgentsPolicy);
export { AgentsPolicy };
//# sourceMappingURL=agents-policy.entity.js.map