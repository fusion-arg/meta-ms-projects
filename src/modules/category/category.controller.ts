import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CategorySerializer } from '../../serializers/category.serializer';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['categories.list', 'client-users.default']))
  @HttpCode(HttpStatus.OK)
  async list() {
    const items = await this.categoryService.all();
    const serializer = new CategorySerializer();

    return serializer.respondMany(items);
  }
}
