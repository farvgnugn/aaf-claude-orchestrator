import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Epic } from './epic.entity';

@Entity('user_stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  public_id: string;

  @ManyToOne(() => Epic, e => e.stories, { onDelete: 'CASCADE' })
  epic: Epic;

  @Column()
  title: string;

  @Column({ default: 'DRAFT' })
  status: string;

  @Column({ nullable: true }) size?: string;
  @Column({ nullable: true }) risk?: string;
  @Column({ default: false }) dependencies_met: boolean;
}