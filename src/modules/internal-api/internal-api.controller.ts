import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { MailSettingService } from '../mail-setting/mail-setting.service';

@Controller('internal-apis')
export class InternalApiController {
  constructor(private readonly mailSettingService: MailSettingService) {}

  @Get('projects/:id/mail-settings')
  @HttpCode(HttpStatus.OK)
  async findConfigurationByProject(@Param('id') projectId: string) {
    return await this.mailSettingService.findSettingByTransporter(projectId);
  }
}
