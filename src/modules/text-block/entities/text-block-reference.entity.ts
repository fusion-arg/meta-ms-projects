import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { TextBlock } from './text-block.entity';
import { ReferenceType } from './reference-type.enum';

@Entity()
export class TextBlockReference extends BaseEntity {
  @Column()
  type: ReferenceType;

  @Column()
  referenceId: string;

  @Column({ type: 'json' })
  metadata: string;

  @ManyToOne(() => TextBlock, (textBlock) => textBlock.references)
  @JoinColumn({ name: 'text_block_id' })
  textBlock: TextBlock;
}
