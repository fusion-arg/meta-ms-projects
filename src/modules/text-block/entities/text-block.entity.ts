import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Spc } from '../../spc/entities/spc.entity';
import { Industry } from '../../industry/entities/industry.entity';
import { Project } from '../../project/entities/project.entity';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { TextBlockReference } from './text-block-reference.entity';

@Entity()
export class TextBlock extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'longtext' })
  description: string;

  @Column({ name: 'created_by', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;

  @Column({ name: 'is_global', default: false })
  isGlobal: boolean;

  @ManyToOne(() => Spc, (spc) => spc.textBlocks, { nullable: true })
  @JoinColumn({ name: 'spc_id' })
  spc: Spc;

  @ManyToOne(() => Industry, (industry) => industry.textBlocks, {
    nullable: true,
  })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @ManyToOne(() => Project, (project) => project.textBlocks, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Category, (category) => category.textBlocks, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.textBlocks, { eager: false })
  @JoinColumn()
  tags: Tag[];

  @OneToMany(() => TextBlockReference, (reference) => reference.textBlock, {
    eager: false,
  })
  references: TextBlockReference[];
}
