import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { PaginationParams } from 'src/helpers/decorators/pagination.decorator';
import { Pagination } from 'src/contracts/pagination.contract';
import { FilterParams } from 'src/helpers/decorators/filter.decorator';
import { SortingParams } from 'src/helpers/decorators/sorting.decorator';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectFilter } from '../../helpers/filters/project.filter';
import { ProjectSorting } from '../../helpers/sortings/project.sorting';
import { ProjectSerializer } from '../../serializers/project/project.serializer';
import { ProjectDetailSerializer } from '../../serializers/project/project-detail.serializer';
import { CreateProjectData } from '../../data/project/create-project.data';
import { UpdateProjectData } from '../../data/project/update-project.data';
import { ProjectUserRoleSerializer } from 'src/serializers/project-user-role.serializer';
import { UserProjectAssignmentData } from 'src/data/project/user-project-assignment.data';
import { UserRoleAssignmentData } from 'src/data/project/user-role-assignment.data';
import { UserProjectSerializer } from 'src/serializers/user-project.serializer';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private project: ProjectService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['projects.list', 'client-users.default']))
  @HttpCode(HttpStatus.OK)
  async list(
    @FilterParams(ProjectFilter) filter: ProjectFilter,
    @SortingParams(ProjectSorting) sorting: ProjectSorting,
    @PaginationParams() paginationParams: Pagination,
    @Req() request: any,
  ) {
    const { items, pagination } = await this.project.filter(
      filter,
      sorting,
      paginationParams,
      request.user,
    );
    const serializer = new ProjectSerializer();

    return serializer.respondMany(items, pagination);
  }

  @Get(':id')
  @UseGuards(new PermissionsGuard(['projects.view', 'client-users.default']))
  @ApiParam({ name: 'id', required: true, type: String })
  @HttpCode(HttpStatus.OK)
  async getProject(@Param('id') id: string) {
    const item = await this.project.findProjectById(id);
    const serializer = new ProjectDetailSerializer();

    return serializer.respond(item);
  }

  @Post()
  @UseGuards(new PermissionsGuard(['projects.create']))
  @ApiBody({ type: CreateProjectData })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProjectData, @Req() request: any) {
    const item = await this.project.create(
      body,
      request.user.id,
      request.user.fullName,
    );
    const serializer = new ProjectSerializer();

    return serializer.respond(item);
  }

  @Put(':id')
  @UseGuards(new PermissionsGuard(['projects.update']))
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateProjectData })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() body: UpdateProjectData) {
    const item = await this.project.update(id, body);
    const serializer = new ProjectSerializer();

    return serializer.respond(item);
  }

  @Delete(':id')
  @UseGuards(new PermissionsGuard(['projects.delete']))
  @ApiParam({ name: 'id', required: true, type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.project.remove(id);
  }

  @Get(':id/users')
  async listUsers(@Param('id') id: string, @Req() request: any) {
    const accessToken = request.headers.authorization;
    const items = await this.project.listUsers(id, accessToken);
    const serializer = new UserProjectSerializer();

    return serializer.respond(items);
  }

  @Post(':id/assign-user')
  async assignUser(
    @Param('id') id: string,
    @Body() body: UserProjectAssignmentData,
  ) {
    const item = await this.project.assignUser(id, body.userId);
    const serializer = new ProjectUserRoleSerializer();

    return serializer.respond(item);
  }

  @Post(':id/assign-stakeholder-user')
  async assignStakeholderUser(
    @Param('id') id: string,
    @Body() dto: UserProjectAssignmentData[],
  ) {
    await this.project.assignStakeHolderUser(id, dto);
  }

  @Post(':id/unassign-user')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unassignUser(
    @Param('id') id: string,
    @Body() body: UserProjectAssignmentData,
  ) {
    return await this.project.unassignUser(id, body.userId);
  }

  @Post(':id/assign-user-role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assignUserRole(
    @Param('id') id: string,
    @Body() body: UserRoleAssignmentData,
  ) {
    return await this.project.assignUserRole(id, body);
  }
}
