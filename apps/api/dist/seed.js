"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
async function main() {
    const p = await prisma.projects.create({ data: { name: 'Rocket OMS', public_id: (0, crypto_1.randomUUID)(), repo_ready: false } });
    const e = await prisma.epics.create({ data: { public_id: (0, crypto_1.randomUUID)(), project_id: p.id, title: 'Epic 1: MVP Foundations' } });
    await prisma.user_stories.createMany({ data: [
            { public_id: (0, crypto_1.randomUUID)(), epic_id: e.id, title: 'As a dev, I can bind a repo' },
            { public_id: (0, crypto_1.randomUUID)(), epic_id: e.id, title: 'As a PM, I can create artifacts' },
        ] });
    console.log('Seeded.');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map