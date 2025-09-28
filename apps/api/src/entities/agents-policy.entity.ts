import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subagent_policy')
export class AgentsPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() project_id: number;
  @Column() agent_name: string;
  @Column({ type: 'int', nullable: true }) max_tokens_per_run?: number;
  @Column({ type: 'simple-array', nullable: true }) allowed_tools?: string[];
  @Column({ default: false }) may_bypass_permissions: boolean;
}