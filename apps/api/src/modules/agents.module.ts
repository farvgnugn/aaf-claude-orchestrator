import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsIndex } from '../entities/agents-index.entity';
import { AgentsPolicy } from '../entities/agents-policy.entity';
import { AgentsController } from '../routes/agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentsIndex, AgentsPolicy])],
  controllers: [AgentsController],
})
export class AgentsModule {}