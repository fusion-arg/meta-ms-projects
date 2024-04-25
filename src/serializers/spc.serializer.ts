import { BaseSerializer } from './base.serializer';
import { Spc } from 'src/modules/spc/entities/spc.entity';

export class SpcSerializer extends BaseSerializer<Spc> {
  serialize(item: Spc): any {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      visibleCode: item.visibleCode,
    };
  }
}
