import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArtifactVersion } from './artifact-version.entity';

@Entity('artifacts')
export class Artifact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  public_id: string;

  @Column()
  project_id: number;

  @Column()
  scope_kind: 'PROJECT'|'EPIC'|'STORY';

  @Column()
  scope_id: number;

  @Column()
  kind: string;

  @Column()
  title: string;

  @Column({ default: 0 })
  current_version_no: number;

  @OneToMany(() => ArtifactVersion, v => v.artifact)
  versions: ArtifactVersion[];
}