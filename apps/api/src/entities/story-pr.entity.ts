import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('story_pull_requests')
export class StoryPR {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() story_id: number;
  @Column() provider: string;
  @Column() repo: string;
  @Column() pr_number: number;
  @Column() branch: string;
  @Column() status: string; // OPEN|MERGED|CLOSED
  @Column() url: string;
  @Column({ nullable: true }) head_sha?: string;
  @Column({ default: 'main' }) base_branch: string;
}