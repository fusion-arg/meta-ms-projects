import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailSetting } from './entities/mail-setting.entity';
import { MailSettingDto } from './dto/mail-setting.dto';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class MailSettingService {
  constructor(
    @InjectRepository(MailSetting)
    private mailSettingRepo: Repository<MailSetting>,
    private readonly config: ConfigService,
  ) {}

  async findConfiguration(projectId: string) {
    return await this.mailSettingRepo.findOne({
      where: { project: { id: projectId } },
    });
  }

  async setConfiguration(projectId: string, data: MailSettingDto) {
    let configuration = await this.findConfiguration(projectId);
    const project = await this.mailSettingRepo.manager
      .getRepository(Project)
      .findOneOrFail({ where: { id: projectId } });

    if (!configuration) {
      configuration = new MailSetting();
    }

    configuration.port = data.port;
    configuration.host = data.host;
    configuration.protocol = data.protocol;
    configuration.username = data.username;
    configuration.password = this.encryptPassword(data.password);
    configuration.senderName = data.senderName;
    configuration.senderEmailAddress = data.senderEmailAddress;
    configuration.project = project;

    return await this.mailSettingRepo.save(configuration);
  }

  encryptPassword(plainTextPassword: string): string {
    return CryptoJS.AES.encrypt(
      plainTextPassword,
      this.config.get('CRYPTO_SECRET_KEY'),
    ).toString();
  }

  decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      this.config.get('CRYPTO_SECRET_KEY'),
    );
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  }

  async findSettingByTransporter(projectId: string) {
    const setting = await this.findConfiguration(projectId);
    if (!setting) return null;
    setting.password = this.decryptPassword(setting.password);
    return setting;
  }
}
