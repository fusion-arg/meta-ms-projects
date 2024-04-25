import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpcService } from './spc.service';
import { SpcSerializer } from 'src/serializers/spc.serializer';

@Controller('spcs')
@ApiTags('spcs')
export class SpcController {
  constructor(private spcService: SpcService) {}

  @Get()
  async list() {
    const data = await this.spcService.all();
    const serializer = new SpcSerializer();

    return serializer.respondMany(data);
  }
}
