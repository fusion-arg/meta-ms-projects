import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class ProjectFutureProcess extends BaseEntity {
  @Column()
  code: string;

  @Column({ name: 'spc_name' })
  spcName: string;

  @Column({ name: 'future_process_name' })
  futureProcessName: string;

  @Column({ name: 'visible_code' })
  visibleCode: string;

  @Column({ name: 'is_selected', default: false })
  isSelected: boolean;

  @Column({ name: 'can_be_unselected', default: false })
  canBeUnselected: boolean;

  @Column({ name: 'is_deletable', default: false })
  isDeletable: boolean;

  @Column({ name: 'is_created_manual', default: false })
  isCreatedManual: boolean;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(
    () => ProjectFutureProcess,
    (projectFutureProcess) => projectFutureProcess.id,
  )
  @JoinColumn({ name: 'parent_id' })
  parent: ProjectFutureProcess;
}
