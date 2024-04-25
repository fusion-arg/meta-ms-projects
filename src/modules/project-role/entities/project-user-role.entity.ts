import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { ProjectRole } from './project-role.entity';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class ProjectUserRole extends BaseEntity {
  @ManyToOne(() => ProjectRole, { nullable: true })
  @JoinColumn({ name: 'project_role_id' })
  projectRole: ProjectRole;

  @Column()
  userId: string;

  @ManyToOne(() => Project, (project) => project.projectUserRoles)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
