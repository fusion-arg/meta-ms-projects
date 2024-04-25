import { BaseSerializer } from './base.serializer';
import { Tag } from '../modules/tag/entities/tag.entity';

export class TagSerializer extends BaseSerializer<Tag> {
  serialize(item: Tag): any {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };
  }
}
