import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { FutureProcess } from '../../project/entities/future-process.entity';
import { TextBlock } from '../../text-block/entities/text-block.entity';
import { QuestionBank } from '../../question-bank/entities/question-bank.entity';

@Entity()
export class Industry extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => FutureProcess, (futureProcess) => futureProcess.industry, {
    eager: false,
  })
  @JoinColumn({ name: 'industry_id' })
  futureProcesses: FutureProcess[];

  @OneToMany(() => TextBlock, (textBlock) => textBlock.industry, {
    eager: false,
  })
  @JoinColumn({ name: 'industry_id' })
  textBlocks: TextBlock[];

  @OneToMany(() => QuestionBank, (questionBank) => questionBank.industry, {
    eager: false,
  })
  @JoinColumn({ name: 'industry_id' })
  questionBanks: QuestionBank[];
}
