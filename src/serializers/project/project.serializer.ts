import { BaseSerializer } from '../base.serializer';
import { Project } from '../../modules/project/entities/project.entity';

export class ProjectSerializer extends BaseSerializer<Project> {
  serialize(item: Project): any {
    const { id, name, client, startDate, dueDate, createdAt } = item;
    const serializedIndustry = {
      id: client.industry.id,
      name: client.industry.name,
    };
    const serializedClient = {
      id: client.id,
      name: client.name,
      licenseInformation: client.licensing,
      industry: serializedIndustry,
    };

    return {
      id,
      name,
      client: serializedClient,
      startDate,
      dueDate,
      createdAt: createdAt.toISOString(),
    };
  }
}
