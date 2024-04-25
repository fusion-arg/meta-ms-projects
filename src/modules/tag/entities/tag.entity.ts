import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Project } from '../../project/entities/project.entity';
import { TextBlock } from '../../text-block/entities/text-block.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.tags)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToMany(() => TextBlock, (textBlock) => textBlock.tags, { eager: false })
  @JoinTable()
  textBlocks: TextBlock[];
}
