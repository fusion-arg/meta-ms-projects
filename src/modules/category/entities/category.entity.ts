import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { TextBlock } from '../../text-block/entities/text-block.entity';
import { QuestionBank } from '../../question-bank/entities/question-bank.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => TextBlock, (textBlock) => textBlock.category, {
    eager: false,
  })
  @JoinColumn({ name: 'category_id' })
  textBlocks: TextBlock[];

  @OneToMany(() => QuestionBank, (questionBank) => questionBank.category, {
    eager: false,
  })
  @JoinColumn({ name: 'category_id' })
  questionBanks: QuestionBank[];
}
