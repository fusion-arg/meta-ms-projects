import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { QuestionBank } from './entities/question-bank.entity';
import { QuestionBankFilter } from '../../helpers/filters/question-bank.filter';
import { Pagination } from '../../contracts/pagination.contract';

@Injectable()
export class QuestionBankService extends PaginationService {
  constructor(
    @InjectRepository(QuestionBank)
    private questionBankRepo: Repository<QuestionBank>,
  ) {
    super();
  }

  async filter(filter: QuestionBankFilter, pagination: Pagination) {
    const queryBuilder = this.questionBankRepo
      .createQueryBuilder('questionBank')
      .leftJoinAndSelect('questionBank.category', 'c')
      .leftJoinAndSelect('questionBank.industry', 'i');

    this.applyFilter(queryBuilder, filter);

    return await this.paginate(queryBuilder, pagination);
  }

  private applyFilter(
    queryBuilder: SelectQueryBuilder<QuestionBank>,
    filter: QuestionBankFilter,
  ): void {
    const { question, categories, industries } = filter;

    if (question) {
      queryBuilder.andWhere(
        `questionBank.title LIKE :questionParam OR questionBank.description LIKE :questionParam `,
        { questionParam: `%${question}%` },
      );
    }
    if (categories) {
      queryBuilder.andWhere(`c.id IN (:...categories)`, { categories });
    }
    if (industries) {
      queryBuilder.andWhere(`i.id IN (:...industries)`, { industries });
    }
  }
}
