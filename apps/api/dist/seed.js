import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
const prisma = new PrismaClient();
async function main() {
    const p = await prisma.projects.create({ data: { name: 'Rocket OMS', public_id: randomUUID(), repo_ready: false } });
    const e = await prisma.epics.create({ data: { public_id: randomUUID(), project_id: p.id, title: 'Epic 1: MVP Foundations' } });
    await prisma.user_stories.createMany({
        data: [
            { public_id: randomUUID(), epic_id: e.id, title: 'As a dev, I can bind a repo' },
            { public_id: randomUUID(), epic_id: e.id, title: 'As a PM, I can create artifacts' }
        ]
    });
    console.log('Seeded project/epic/stories.');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map