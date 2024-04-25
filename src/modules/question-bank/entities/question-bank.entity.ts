import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Industry } from '../../industry/entities/industry.entity';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class QuestionBank extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: 'longtext' })
  description: string;

  @Column()
  type: string;

  @Column({ type: 'json' })
  options: string;

  @ManyToOne(() => Industry, (industry) => industry.questionBanks, {
    nullable: true,
  })
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @ManyToOne(() => Category, (category) => category.questionBanks, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
