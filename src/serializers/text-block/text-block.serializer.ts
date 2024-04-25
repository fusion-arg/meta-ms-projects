import { BaseSerializer } from '../base.serializer';
import { TextBlock } from '../../modules/text-block/entities/text-block.entity';

export class TextBlockSerializer extends BaseSerializer<TextBlock> {
  serialize(item: TextBlock): any {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      createdBy: item.createdBy,
      createdAt: item.createdAt,
      updatedBy: item.updatedBy,
      updatedAt: item.updatedAt,
      isGlobal: item.isGlobal,
    };
  }
}
