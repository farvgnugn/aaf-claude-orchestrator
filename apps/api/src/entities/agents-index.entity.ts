import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subagent_index')
export class AgentsIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() project_id: number;
  @Column() name: string;
  @Column() file_path: string;
  @Column() sha256: string;
  @Column({ default: true }) enabled: boolean;
}