import { Module } from '@nestjs/common';
import { DocsController } from '../routes/docs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DocsController],
  providers: [PrismaService],
})
export class DocsModule {}