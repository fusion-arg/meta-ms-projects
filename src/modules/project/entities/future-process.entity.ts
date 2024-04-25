import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Spc } from '../../spc/entities/spc.entity';
import { Industry } from '../../industry/entities/industry.entity';

@Entity()
@Unique(['code', 'industry'])
export class FutureProcess extends BaseEntity {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ name: 'visible_code' })
  visibleCode: string;

  @ManyToOne(() => Spc, (spc) => spc.futureProcesses)
  @JoinColumn({ name: 'spc_id' })
  spc: Spc;

  @ManyToOne(() => FutureProcess, (futureProcess) => futureProcess.id)
  @JoinColumn({ name: 'parent_id' })
  parent: FutureProcess;

  @ManyToOne(() => Industry, (industry) => industry.futureProcesses)
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;
}
