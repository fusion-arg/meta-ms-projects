import { ProjectRole } from 'src/modules/project-role/entities/project-role.entity';
import { BaseSerializer } from './base.serializer';

export class ProjectRoleSerializer extends BaseSerializer<ProjectRole> {
  serialize(item: ProjectRole): any {
    return {
      id: item.id,
      name: item.name,
    };
  }
}
