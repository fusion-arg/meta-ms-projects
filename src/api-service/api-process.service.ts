import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { SelectedFutureProcessData } from '../data/api-process/selected-future-process.data';

@Injectable()
export class ApiProcessService {
  private readonly baseUrl = this.config.get('META_PROCESS_URL');

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

  async selectedFutureProcess(
    projectId: string,
    postData: SelectedFutureProcessData[],
    token: string,
  ): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    return this.post<SelectedFutureProcessData[]>(
      `${this.baseUrl}/projects/${projectId}/selected-future-process`,
      postData,
      config,
    ).then((response) => {
      if (response.status === 201) {
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

  async getProcesses(referenceIds: string[]): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {},
    };

    const payload = {
      referenceIds,
    };

    return this.post<any>(
      `${this.baseUrl}/internal-apis/processes-for-text-blocks`,
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
