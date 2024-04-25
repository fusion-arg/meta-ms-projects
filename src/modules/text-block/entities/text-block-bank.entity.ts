import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Spc } from '../../spc/entities/spc.entity';
import { Industry } from '../../industry/entities/industry.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class TextBlockBank extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'longtext' })
  description: string;

  @ManyToOne(() => Spc, (spc) => spc.textBlocks, { nullable: true })
  @JoinColumn({ name: 'spc_id' })
  spc: Spc;

  @ManyToOne(() => Industry, (industry) => industry.textBlocks, {
    nullable: true,
  })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @ManyToOne(() => Category, (category) => category.textBlocks, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
