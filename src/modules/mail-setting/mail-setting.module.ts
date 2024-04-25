import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { MailSetting } from './entities/mail-setting.entity';
import { MailSettingController } from './mail-setting.controller';
import { MailSettingService } from './mail-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([MailSetting])],
  controllers: [MailSettingController],
  providers: [MailSettingService],
})
export class MailSettingModule {}
