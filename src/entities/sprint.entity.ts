import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from '../modules/project/entities/project.entity';

@Entity()
export class Sprint extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.sprints, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
