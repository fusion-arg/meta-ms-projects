import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IndustryModule } from './modules/industry/industry.module';
import { APP_PIPE } from '@nestjs/core';
import { CommandModule } from './commands/command.module';
import { TypeOrmModule } from './modules/typeorm/typeorm.module';
import { ProjectModule } from './modules/project/project.module';
import { ClientModule } from './modules/client/client.module';
import { HttpModule } from '@nestjs/axios';
import { ProjectFutureProcessModule } from './modules/project-future-process/project-future-process.module';
import { SpcModule } from './modules/spc/spc.module';
import { ProjectRoleModule } from './modules/project-role/project-role.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { CategoryModule } from './modules/category/category.module';
import { TextBlockModule } from './modules/text-block/text-block.module';
import { TagModule } from './modules/tag/tag.module';
import { MailSettingModule } from './modules/mail-setting/mail-setting.module';
import { InternalApiModule } from './modules/internal-api/internal-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule,
    ProjectModule,
    IndustryModule,
    ClientModule,
    ProjectFutureProcessModule,
    SpcModule,
    ProjectRoleModule,
    QuestionBankModule,
    CategoryModule,
    TextBlockModule,
    TagModule,
    MailSettingModule,
    CommandModule,
    HttpModule,
    InternalApiModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        always: true,
      }),
    },
  ],
})
export class AppModule {}
