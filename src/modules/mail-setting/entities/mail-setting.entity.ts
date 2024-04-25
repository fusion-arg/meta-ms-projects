import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Project } from '../../project/entities/project.entity';

@Entity()
export class MailSetting extends BaseEntity {
  @Column()
  host: string;

  @Column()
  port: string;

  @Column()
  protocol: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ name: 'sender_name' })
  senderName: string;

  @Column({ name: 'sender_email_address' })
  senderEmailAddress: string;

  @ManyToOne(() => Project, (project) => project.mailSettings)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
