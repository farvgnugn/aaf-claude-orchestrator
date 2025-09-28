import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Epic } from './epic.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  public_id: string;

  @Column()
  name: string;

  @Column({ nullable: true }) repo_provider?: string;
  @Column({ nullable: true }) repo_url?: string;
  @Column({ default: 'main' }) repo_default_branch: string;
  @Column({ nullable: true }) workspace_root?: string;
  @Column({ default: false }) repo_ready: boolean;

  @OneToMany(() => Epic, e => e.project)
  epics: Epic[];
}