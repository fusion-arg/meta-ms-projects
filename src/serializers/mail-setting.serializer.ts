import { BaseSerializer } from './base.serializer';
import { MailSetting } from '../modules/mail-setting/entities/mail-setting.entity';

export class MailSettingSerializer extends BaseSerializer<MailSetting> {
  serialize(item: MailSetting): any {
    if (!item) {
      return null;
    }

    return {
      id: item.id,
      host: item.host,
      port: item.port,
      protocol: item.protocol,
      username: item.username,
      senderName: item.senderName,
      senderEmailAddress: item.senderEmailAddress,
    };
  }
}
