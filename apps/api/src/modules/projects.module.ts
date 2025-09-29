import { Module } from '@nestjs/common';
import { ProjectsController } from '../routes/projects.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProjectsController],
  providers: [PrismaService],
})
export class ProjectsModule {}