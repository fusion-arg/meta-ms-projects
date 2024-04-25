import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRole } from 'src/modules/project-role/entities/project-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectRepository(ProjectRole)
    private projectRoleRepo: Repository<ProjectRole>,
  ) {}

  async all(): Promise<ProjectRole[]> {
    const queryBuilder = this.projectRoleRepo.createQueryBuilder('projectRole');

    queryBuilder.addOrderBy('projectRole.name', 'ASC');

    const [items] = await queryBuilder.getManyAndCount();

    return items;
  }
}
