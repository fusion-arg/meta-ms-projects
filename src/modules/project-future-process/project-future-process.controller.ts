import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProjectFutureProcessService } from './project-future-process.service';
import { SelectedProjectFutureProcessData } from 'src/data/project-future-process/selected-project-future-process.data';
import { Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { ProjectFutureProcessSerializer } from '../../serializers/project-future-process.serializer';
import { CreateProjectFutureProcessData } from '../../data/project-future-process/create-project-future-process.data';
import { FutureProcessData } from '../../data/api-process/future-process.data';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Controller('project-future-processes')
@ApiTags('project-future-processes')
export class ProjectFutureProcessController {
  constructor(
    private projectFutureProcessService: ProjectFutureProcessService,
  ) {}

  @Post()
  @UseGuards(new PermissionsGuard(['future-processes.create']))
  @ApiBody({ type: CreateProjectFutureProcessData })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProjectFutureProcessData) {
    return await this.projectFutureProcessService.create(body);
  }

  @Post('update-selection')
  @UseGuards(new PermissionsGuard(['future-processes.fill']))
  @ApiBody({ type: SelectedProjectFutureProcessData })
  async updateSelection(
    @Body() body: SelectedProjectFutureProcessData,
    @Request() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    return await this.projectFutureProcessService.updateSelection(body, token);
  }

  @Get(':id')
  @UseGuards(
    new PermissionsGuard(['future-processes.list', 'client-users.default']),
  )
  @ApiParam({ name: 'id', required: true, type: String })
  @HttpCode(HttpStatus.OK)
  async getProjectFutureProcess(@Param('id') id: string) {
    const items = await this.projectFutureProcessService.findFutureProcess(id);
    const serializer = new ProjectFutureProcessSerializer();

    return serializer.respond(items);
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @HttpCode(HttpStatus.OK)
  async unSelectedFutureProcess(
    @Param('id') id: string,
    @Body() body: FutureProcessData,
  ) {
    await this.projectFutureProcessService.setUnSelectedFutureProcess(id, body);
  }
}
