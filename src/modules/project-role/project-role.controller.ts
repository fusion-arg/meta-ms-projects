import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectRoleService } from './project-role.service';
import { ProjectRoleSerializer } from 'src/serializers/project-role.serializer';

@Controller('project-roles')
@ApiTags('project-roles')
export class ProjectRoleController {
  constructor(private service: ProjectRoleService) {}

  @Get()
  async listRoles() {
    const items = await this.service.all();
    const serializer = new ProjectRoleSerializer();

    return serializer.respondMany(items);
  }
}
