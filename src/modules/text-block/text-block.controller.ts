import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TextBlockService } from './text-block.service';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { TextBlockFilter } from '../../helpers/filters/text-block.filter';
import { Pagination } from '../../contracts/pagination.contract';
import { PaginationParams } from '../../helpers/decorators/pagination.decorator';
import { FilterParams } from '../../helpers/decorators/filter.decorator';
import { TextBlockSerializer } from '../../serializers/text-block/text-block.serializer';
import { TextBlockDetailSerializer } from '../../serializers/text-block/text-block-detail.serializer';
import { TextBlockData } from '../../data/text-block/text-block.data';

@Controller('projects/:projectId/text-blocks')
@ApiTags('text-blocks')
export class TextBlockController {
  constructor(private textBlockService: TextBlockService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['text-blocks.list', 'client-users.default']))
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('projectId') projectId: string,
    @FilterParams(TextBlockFilter) filter: TextBlockFilter,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const { items, pagination } = await this.textBlockService.filter(
      projectId,
      filter,
      paginationParams,
    );
    const serializer = new TextBlockSerializer();

    return serializer.respondMany(items, pagination);
  }

  @Get(':id')
  @UseGuards(new PermissionsGuard(['text-blocks.view', 'client-users.default']))
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    const item = await this.textBlockService.findOne(projectId, id);
    const serializer = new TextBlockDetailSerializer();

    return serializer.respond(item);
  }

  @Post()
  @UseGuards(
    new PermissionsGuard(['text-blocks.create', 'client-users.default']),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('projectId') projectId: string,
    @Body() body: TextBlockData,
    @Req() request: any,
  ) {
    const item = await this.textBlockService.create(
      projectId,
      body,
      request.user.fullName,
    );
    const serializer = new TextBlockDetailSerializer();

    return serializer.respond(item);
  }

  @Put(':id')
  @UseGuards(
    new PermissionsGuard(['text-blocks.update', 'client-users.default']),
  )
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() body: TextBlockData,
    @Req() request: any,
  ) {
    const item = await this.textBlockService.updateTextBlock(
      projectId,
      id,
      body,
      request.user.fullName,
    );
    const serializer = new TextBlockDetailSerializer();

    return serializer.respond(item);
  }
}
