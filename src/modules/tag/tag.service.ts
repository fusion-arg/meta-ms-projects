import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}

  async findAllByProject(projectId: string): Promise<Tag[]> {
    return this.tagRepo.find({
      where: { project: { id: projectId } },
      order: { name: 'ASC' },
    });
  }
}
