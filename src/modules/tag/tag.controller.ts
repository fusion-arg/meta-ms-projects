import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { TagSerializer } from '../../serializers/tag.serializer';

@Controller('projects/:id/tags')
@ApiTags('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['tags.list', 'client-users.default']))
  @HttpCode(HttpStatus.OK)
  async list(@Param('id') id: string) {
    const items = await this.tagService.findAllByProject(id);
    const serializer = new TagSerializer();

    return serializer.respondMany(items);
  }
}
