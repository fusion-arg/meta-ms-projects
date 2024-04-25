import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Project } from '../../project/entities/project.entity';
import { Industry } from '../../industry/entities/industry.entity';

@Entity()
export class Client extends BaseEntity {
  @Column()
  name: string;

  @Column()
  licensing: string;

  @ManyToOne(() => Industry, (industry) => industry.id)
  @JoinColumn({ name: 'industry_id' })
  industry: Industry;

  @OneToMany(() => Project, (project) => project.client, { eager: false })
  @JoinColumn({ name: 'client_id' })
  projects: Project[];
}
