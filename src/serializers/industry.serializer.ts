import { Industry } from 'src/modules/industry/entities/industry.entity';
import { BaseSerializer } from './base.serializer';

export class IndustrySerializer extends BaseSerializer<Industry> {
  serialize(item: Industry): any {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };
  }
}
