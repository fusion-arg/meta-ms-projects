import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class ApiSurveyService {
  private readonly baseUrl = this.config.get('META_SURVEY_URL');
  private readonly clientId = this.config.get('OAUTH_CLIENT_ID');
  private readonly clientSecret = this.config.get('OAUTH_CLIENT_SECRET');

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async post<T>(
    method: string,
    dto: T,
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return await lastValueFrom(
      this.httpService
        .post(method, dto, config)
        .pipe(map((response) => response))
        .pipe(
          catchError((e) => {
            Logger.error(e, 'Error POST api-process');
            throw new HttpException('Api error', HttpStatus.BAD_REQUEST);
          }),
        ),
    );
  }

  async getSurveys(referenceIds: string[]): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        'client-id': this.clientId,
        'client-secret': this.clientSecret,
      },
    };

    const payload = {
      referenceIds,
    };

    return this.post<any>(
      `${this.baseUrl}/internal-apis/surveys-for-text-blocks`,
      payload,
      config,
    ).then((response) => {
      if (response.status === 200) {
        Logger.debug(JSON.stringify(response.data), '[SYNC-PROCESS-OK]');
        return response.data;
      }
      Logger.debug(JSON.stringify(response.data), '[SYNC-PROCESS-ERROR]');
      throw new HttpException(
        'Api error: Invalid status code',
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
