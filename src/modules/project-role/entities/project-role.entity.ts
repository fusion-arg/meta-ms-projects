import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';

@Entity()
export class ProjectRole extends BaseEntity {
  @Column()
  name: string;
}
