import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spc } from 'src/modules/spc/entities/spc.entity';

@Injectable()
export class SpcService {
  constructor(
    @InjectRepository(Spc)
    private spcRepository: Repository<Spc>,
  ) {}

  async all(): Promise<Spc[]> {
    const queryBuilder = this.spcRepository.createQueryBuilder('spc');

    queryBuilder.addOrderBy('spc.code', 'ASC');

    return queryBuilder.getMany();
  }
}
