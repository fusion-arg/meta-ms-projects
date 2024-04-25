import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from 'src/modules/industry/entities/industry.entity';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { Repository } from 'typeorm';

@Injectable()
export class IndustryService extends PaginationService {
  constructor(
    @InjectRepository(Industry) private industryRepo: Repository<Industry>,
  ) {
    super();
  }

  async all() {
    const queryBuilder = this.industryRepo.createQueryBuilder('industry');

    queryBuilder.addOrderBy('industry.name', 'ASC');

    const [items] = await queryBuilder.getManyAndCount();

    return {
      items,
    };
  }
}
