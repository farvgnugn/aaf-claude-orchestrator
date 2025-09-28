import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Story } from './story.entity';

@Entity('epics')
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  public_id: string;

  @ManyToOne(() => Project, p => p.epics, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  title: string;

  @Column({ default: 'OPEN' })
  status: string;

  @OneToMany(() => Story, s => s.epic)
  stories: Story[];
}