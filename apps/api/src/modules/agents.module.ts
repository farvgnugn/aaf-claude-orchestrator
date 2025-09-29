import { Module } from '@nestjs/common';
import { AgentsController } from '../routes/agents.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AgentsController],
  providers: [PrismaService],
})
export class AgentsModule {}