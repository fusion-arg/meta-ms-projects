import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { FutureProcess } from '../../project/entities/future-process.entity';
import { TextBlock } from '../../text-block/entities/text-block.entity';

@Entity()
export class Spc extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ name: 'visible_code' })
  visibleCode: string;

  @ManyToOne(() => Spc)
  @JoinColumn({ name: 'parent_id' })
  parent: Spc;

  @OneToMany(() => FutureProcess, (futureProcess) => futureProcess.spc, {
    eager: false,
  })
  @JoinColumn({ name: 'spc_id' })
  futureProcesses: FutureProcess[];

  @OneToMany(() => TextBlock, (textBlock) => textBlock.spc, { eager: false })
  @JoinColumn({ name: 'spc_id' })
  textBlocks: TextBlock[];
}
