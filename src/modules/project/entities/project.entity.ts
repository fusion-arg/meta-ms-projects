import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Client } from '../../client/entities/client.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { MailSetting } from '../../mail-setting/entities/mail-setting.entity';
import { TextBlock } from '../../text-block/entities/text-block.entity';
import { Sprint } from '../../../entities/sprint.entity';
import { ProjectUserRole } from '../../project-role/entities/project-user-role.entity';

@Entity()
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ name: 'due_date', nullable: false })
  dueDate: Date;

  @Column({ name: 'logo', type: 'longtext' })
  logo: string;

  @ManyToOne(() => Client, (client) => client.projects)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToMany(() => Tag, (tag) => tag.project, { eager: false })
  @JoinColumn({ name: 'project_id' })
  tags: Tag[];

  @OneToMany(() => MailSetting, (mailSetting) => mailSetting.project, {
    eager: false,
  })
  mailSettings: MailSetting[];

  @OneToMany(() => TextBlock, (textBlock) => textBlock.project, {
    eager: false,
  })
  @JoinColumn({ name: 'project_id' })
  textBlocks: TextBlock[];

  @OneToMany(() => Sprint, (sprint) => sprint.project, { eager: false })
  @JoinColumn({ name: 'project_id' })
  sprints: Sprint[];

  @OneToMany(
    () => ProjectUserRole,
    (projectUserRole) => projectUserRole.project,
  )
  @JoinColumn({ name: 'project_id' })
  projectUserRoles: ProjectUserRole[];
}
