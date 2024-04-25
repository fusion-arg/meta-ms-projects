import { BaseSerializer } from './base.serializer';
import { ProjectUserRole } from 'src/modules/project-role/entities/project-user-role.entity';

export class ProjectUserRoleSerializer extends BaseSerializer<ProjectUserRole> {
  serialize(item: ProjectUserRole): any {
    return {
      id: item.id,
      userId: item.userId,
      role: item.projectRole
        ? {
            id: item.projectRole.id,
            name: item.projectRole.name,
          }
        : null,
    };
  }
}
