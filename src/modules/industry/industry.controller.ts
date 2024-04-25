import { Controller, Get } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { IndustrySerializer } from 'src/serializers/industry.serializer';

import { ApiTags } from '@nestjs/swagger';

@Controller('industries')
@ApiTags('industries')
export class IndustryController {
  constructor(private industries: IndustryService) {}

  @Get()
  async list() {
    const { items } = await this.industries.all();
    const serializer = new IndustrySerializer();

    return serializer.respondMany(items);
  }
}
