import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalApiController } from './internal-api.controller';
import { MailSettingService } from '../mail-setting/mail-setting.service';
import { MailSetting } from '../mail-setting/entities/mail-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailSetting])],
  controllers: [InternalApiController],
  providers: [MailSettingService],
})
export class InternalApiModule {}
