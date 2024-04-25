import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MailSettingService } from './mail-setting.service';
import { MailSettingSerializer } from '../../serializers/mail-setting.serializer';
import { MailSettingDto } from './dto/mail-setting.dto';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Controller('projects/:projectId/mail-settings')
export class MailSettingController {
  constructor(private mailSettings: MailSettingService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['mail-settings.view']))
  async findConfiguration(@Param('projectId') projectId: string) {
    const item = await this.mailSettings.findConfiguration(projectId);
    const serializer = new MailSettingSerializer();

    return serializer.respond(item);
  }

  @Post()
  @UseGuards(new PermissionsGuard(['mail-settings.set']))
  @HttpCode(HttpStatus.CREATED)
  async setConfiguration(
    @Param('projectId') projectId: string,
    @Body() data: MailSettingDto,
  ) {
    await this.mailSettings.setConfiguration(projectId, data);
  }
}
