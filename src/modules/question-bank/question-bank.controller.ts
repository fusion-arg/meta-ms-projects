import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';

import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../contracts/pagination.contract';
import { FilterParams } from '../../helpers/decorators/filter.decorator';
import { PaginationParams } from '../../helpers/decorators/pagination.decorator';
import { QuestionBankFilter } from '../../helpers/filters/question-bank.filter';
import { QuestionBankSerializer } from '../../serializers/question-bank.serializer';
import { PermissionsGuard } from '../../guards/permissions.guard';

@Controller('question-banks')
@ApiTags('question-banks')
export class QuestionBankController {
  constructor(private questionBankService: QuestionBankService) {}

  @Get()
  @UseGuards(
    new PermissionsGuard(['question-banks.list', 'client-users.default']),
  )
  @HttpCode(HttpStatus.OK)
  async list(
    @FilterParams(QuestionBankFilter) filter: QuestionBankFilter,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const { items, pagination } = await this.questionBankService.filter(
      filter,
      paginationParams,
    );
    const serializer = new QuestionBankSerializer();

    return serializer.respondMany(items, pagination);
  }
}
