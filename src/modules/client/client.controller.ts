import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateClientData } from '../../data/create-client.data';
import { ClientSerializer } from '../../serializers/client.serializer';

@Controller('clients')
@ApiTags('clients')
export class ClientController {
  constructor(private client: ClientService) {}

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  async getClient(@Param('id') id: string) {
    const item = await this.client.findClient(id);
    const serializer = new ClientSerializer();

    return serializer.respond(item);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list() {
    const items = await this.client.all();
    const serializer = new ClientSerializer();
    return serializer.respondMany(items);
  }

  @Post()
  @ApiBody({ type: CreateClientData })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateClientData) {
    const item = await this.client.create(body);
    const serializer = new ClientSerializer();

    return serializer.respond(item);
  }
}
