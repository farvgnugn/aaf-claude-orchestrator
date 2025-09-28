import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('story_approvals')
export class StoryApproval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  story_public_id: string;

  @Column()
  stage: string; // PO or HUMAN

  @Column()
  decision: string; // APPROVE|REVISE|REJECT

  @Column({ type: 'jsonb' })
  rubric_json: any;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column()
  decided_by: string; // 'subagent:po' or user id/email
}