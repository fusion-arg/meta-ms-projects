import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiProcessService } from './api-process.service';
import { ApiSurveyService } from './api-survey.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5,
        headers: {
          'Response-Content-Type': 'json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ApiProcessService, ApiSurveyService],
  exports: [ApiProcessService, ApiSurveyService],
})
export class ApiServiceModule {}
