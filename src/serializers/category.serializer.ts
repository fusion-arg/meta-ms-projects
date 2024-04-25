import { BaseSerializer } from './base.serializer';
import { Category } from '../modules/category/entities/category.entity';

export class CategorySerializer extends BaseSerializer<Category> {
  serialize(item: Category): any {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };
  }
}
