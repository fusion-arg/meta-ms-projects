import { BaseSerializer } from './base.serializer';
import { Client } from '../modules/client/entities/client.entity';

export class ClientSerializer extends BaseSerializer<Client> {
  serialize(item: Client): any {
    const { id, name, licensing, industry, createdAt } = item;
    const serializedIndustry = { id: industry.id, name: industry.name };

    return {
      id,
      name,
      licenseInformation: licensing,
      industry: serializedIndustry,
      createdAt: createdAt.toISOString(),
    };
  }
}
