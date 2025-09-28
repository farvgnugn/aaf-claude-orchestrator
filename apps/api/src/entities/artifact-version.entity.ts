import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artifact } from './artifact.entity';

@Entity('artifact_versions')
export class ArtifactVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Artifact, a => a.versions, { onDelete: 'CASCADE' })
  artifact: Artifact;

  @Column()
  version_no: number;

  @Column({ type: 'text', nullable: true })
  content_md?: string;

  @Column({ type: 'jsonb', nullable: true })
  content_json?: any;

  @Column()
  author_type: string; // 'user' | 'subagent'

  @Column()
  author_ref: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}