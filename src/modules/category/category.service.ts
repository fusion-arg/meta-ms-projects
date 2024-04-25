import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService extends PaginationService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {
    super();
  }

  async all() {
    return this.categoryRepo.find({
      order: { name: 'ASC' },
    });
  }
}
