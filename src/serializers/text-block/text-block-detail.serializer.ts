import { TextBlock } from '../../modules/text-block/entities/text-block.entity';
import { TextBlockSerializer } from './text-block.serializer';

export class TextBlockDetailSerializer extends TextBlockSerializer {
  serialize(item: TextBlock): any {
    const serializedData = super.serialize(item);

    const category = item.category
      ? { id: item.category.id, name: item.category.name }
      : null;
    const tags = item.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
    }));

    return {
      ...serializedData,
      tags,
      category,
      references: item['referenceDetail'],
    };
  }
}
