import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { TextBlock } from './entities/text-block.entity';
import { Pagination } from '../../contracts/pagination.contract';
import { TextBlockFilter } from '../../helpers/filters/text-block.filter';
import { TextBlockData } from '../../data/text-block/text-block.data';
import { Project } from '../project/entities/project.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Category } from '../category/entities/category.entity';
import { TagData } from '../../data/text-block/tag.data';
import { v4 as uuidv4 } from 'uuid';
import { TextBlockBank } from './entities/text-block-bank.entity';
import { TextBlockReference } from './entities/text-block-reference.entity';
import { ReferenceData } from '../../data/text-block/reference.data';
import { ReferenceType } from './entities/reference-type.enum';
import { ApiProcessService } from '../../api-service/api-process.service';
import { ApiSurveyService } from '../../api-service/api-survey.service';

@Injectable()
export class TextBlockService extends PaginationService {
  constructor(
    @InjectRepository(TextBlock) private textBlockRepo: Repository<TextBlock>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(TextBlockBank)
    private textBlockBackRepository: Repository<TextBlockBank>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(ApiProcessService)
    private readonly apiProcessService: ApiProcessService,
    @Inject(ApiSurveyService)
    private readonly apiSurveyService: ApiSurveyService,
  ) {
    super();
  }

  async filter(
    projectId: string,
    filter: TextBlockFilter,
    pagination: Pagination,
  ) {
    const queryBuilder = this.textBlockRepo
      .createQueryBuilder('textBlock')
      .leftJoinAndSelect('textBlock.category', 'c')
      .leftJoinAndSelect('textBlock.tags', 't')
      .leftJoinAndSelect('textBlock.references', 'ref')
      .andWhere('textBlock.project.id = :projectId', { projectId });

    this.applyFilter(queryBuilder, filter);

    return await this.paginate(queryBuilder, pagination);
  }

  private applyFilter(
    queryBuilder: SelectQueryBuilder<TextBlock>,
    filter: TextBlockFilter,
  ): void {
    const {
      question,
      categories,
      tags,
      createdAtFrom,
      createdAtTo,
      updatedAtFrom,
      updatedAtTo,
      referenceId,
      excludeReferenceId,
    } = filter;
    if (question) {
      queryBuilder.andWhere(
        `textBlock.title LIKE :questionParam OR textBlock.description LIKE :questionParam `,
        { questionParam: `%${question}%` },
      );
    }
    if (categories) {
      queryBuilder.andWhere(`c.id IN (:...categories)`, { categories });
    }
    if (tags) {
      queryBuilder.andWhere(`t.id IN (:...tags)`, { tags });
    }
    if (createdAtFrom) {
      queryBuilder.andWhere(`textBlock.createdAt >= :createdValueGT`, {
        createdValueGT: createdAtFrom,
      });
    }
    if (createdAtTo) {
      queryBuilder.andWhere(`textBlock.createdAt <= :createdValueLT`, {
        createdValueLT: createdAtTo,
      });
    }
    if (updatedAtFrom) {
      queryBuilder.andWhere(`textBlock.updatedAt >= :updatedValueGT`, {
        updatedValueGT: updatedAtFrom,
      });
    }
    if (updatedAtTo) {
      queryBuilder.andWhere(`textBlock.updatedAt <= :updatedValueLT`, {
        updatedValueLT: updatedAtTo,
      });
    }
    if (referenceId) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TextBlockReference, 'tbref')
          .where('tbref.text_block_id = textBlock.id')
          .andWhere('tbref.referenceId = :referenceId', { referenceId })
          .getQuery();
        return `EXISTS ${subQuery}`;
      });
    }
    if (excludeReferenceId) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TextBlockReference, 'tbref')
          .where('tbref.text_block_id = textBlock.id')
          .andWhere('tbref.referenceId = :excludeReferenceId', {
            excludeReferenceId,
          })
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      });
    }
  }

  async findOne(projectId: string, id: string): Promise<TextBlock> {
    const textBlock = await this.textBlockRepo.findOne({
      where: { id },
      relations: ['project', 'tags', 'category', 'references'],
    });

    if (
      !textBlock ||
      (textBlock.project && textBlock.project.id !== projectId)
    ) {
      throw new NotFoundException('Text block not found');
    }

    const { surveyReferences, presentationReferences } =
      textBlock.references.reduce(
        (acc, reference) => {
          if (reference.type === ReferenceType.SURVEY_ANSWER) {
            acc.surveyReferences.push(reference.referenceId);
          } else if (reference.type === ReferenceType.PRESENTATION_STEP) {
            acc.presentationReferences.push(reference.referenceId);
          }
          return acc;
        },
        { surveyReferences: [], presentationReferences: [] },
      );

    const steps = presentationReferences.length
      ? await this.apiProcessService.getProcesses(presentationReferences)
      : [];
    const answers = surveyReferences.length
      ? await this.apiSurveyService.getSurveys(surveyReferences)
      : [];

    textBlock['referenceDetail'] = steps.concat(answers);

    return textBlock;
  }

  async create(
    projectId: string,
    dto: TextBlockData,
    user: string,
  ): Promise<TextBlock> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('project not found');
    }
    try {
      const textBlock = await this.textBlockRepo.manager.transaction(
        async (manager) => {
          const allTags = await this.getTags(manager, dto, project);
          const category = await this.getCategory(manager, dto);
          const id = uuidv4();
          const textBlock = this.textBlockRepo.create({
            id,
            project,
            title: dto.title,
            description: dto.description,
            createdBy: user,
            tags: allTags,
            category,
          });

          await manager.getRepository(TextBlock).save(textBlock);

          if (dto.references && dto.references.length) {
            await this.saveReferences(manager, textBlock, dto.references);
          }

          return textBlock;
        },
      );
      return textBlock;
    } catch (error) {
      console.log(error);
      Logger.error(error, 'Error -> createTextBlock');
      throw new BadRequestException(error);
    }
  }

  async updateTextBlock(
    projectId: string,
    id: string,
    dto: TextBlockData,
    user: string,
  ): Promise<TextBlock> {
    try {
      const editedTextBlock = await this.textBlockRepo.manager.transaction(
        async (manager) => {
          const textBlock = await this.findOne(projectId, id);
          const project = textBlock.project;

          const allTags = await this.getTags(manager, dto, project);
          const category = await this.getCategory(manager, dto);
          textBlock.category = category;
          textBlock.title = dto.title;
          textBlock.description = dto.description;
          textBlock.tags = allTags;
          textBlock.updatedBy = user;
          await manager.getRepository(TextBlock).save(textBlock);

          await manager
            .getRepository(TextBlockReference)
            .createQueryBuilder('reference')
            .innerJoinAndSelect('reference.textBlock', 'textBlock')
            .delete()
            .where('textBlock.id = :textBlock', { textBlock: textBlock.id })
            .execute();

          if (dto.references && dto.references.length) {
            await this.saveReferences(manager, textBlock, dto.references);
          }

          return textBlock;
        },
      );
      return editedTextBlock;
    } catch (error) {
      Logger.error(error, 'Error -> updateTextBlock');
      throw new BadRequestException(error);
    }
  }

  private async saveReferences(
    manager: EntityManager,
    textBlock: TextBlock,
    references: ReferenceData[],
  ) {
    for (const item of references) {
      const reference = new TextBlockReference();
      reference.referenceId = item.referenceId;
      reference.type = item.type;
      reference.metadata = JSON.stringify(item.metadata);
      reference.textBlock = textBlock;

      await manager.getRepository(TextBlockReference).save(reference);
    }
  }

  private async getTags(
    manager: EntityManager,
    dto: TextBlockData,
    project: Project,
  ): Promise<Tag[]> {
    const existingTags = await this.validateTagsExistence(
      manager,
      dto.tags,
      project.id,
    );

    const nullTagsData = dto.tags
      ? dto.tags.filter((tag) => tag.id === null)
      : [];
    const createdTags = await this.createTags(manager, nullTagsData, project);

    const allTags = [
      ...(Array.isArray(existingTags) ? existingTags : []),
      ...(Array.isArray(createdTags) ? createdTags : []),
    ];
    return allTags;
  }

  private async getCategory(
    manager: EntityManager,
    dto: TextBlockData,
  ): Promise<Category> {
    let category = null;
    if (dto.category) {
      category = await manager.getRepository(Category).findOne({
        where: { id: dto.category },
      });
    }
    return category;
  }

  async validateTagsExistence(
    manager: EntityManager,
    tags: TagData[],
    projectId: string,
  ): Promise<Tag[]> {
    if (!tags || !tags.length) return null;
    const tagIds = tags.filter((tag) => tag.id !== null).map((tag) => tag.id);

    const existingTags = await manager.getRepository(Tag).find({
      where: { id: In(tagIds), project: { id: projectId } },
    });

    if (existingTags.length !== tagIds.length) {
      const existingTagIds = existingTags.map((tag) => tag.id);
      const nonExistingTagIds = tagIds.filter(
        (tagId) => !existingTagIds.includes(tagId),
      );
      throw new NotFoundException(
        `Tags not found: ${nonExistingTagIds.join(', ')}`,
      );
    }

    return existingTags;
  }

  async createTags(
    manager: EntityManager,
    tagsData: TagData[],
    project: Project,
  ): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const dto of tagsData) {
      const newTag = this.tagRepository.create({
        name: dto.name,
        project,
      });
      tags.push(newTag);
    }

    await manager.getRepository(Tag).save(tags);
    return tags;
  }

  async assignTextBlockBank(project: Project, user: string): Promise<void> {
    const textBlockBank = await this.textBlockBackRepository.find({
      relations: ['category', 'spc', 'industry'],
    });

    const textBlocks: TextBlock[] = [];
    for (const tb of textBlockBank) {
      const textBlock = this.textBlockRepo.create({
        id: uuidv4(),
        title: tb.title,
        description: tb.description,
        category: tb.category,
        industry: tb.industry,
        spc: tb.spc,
        project,
        createdBy: user,
        isGlobal: true,
      });
      textBlocks.push(textBlock);
    }

    await this.textBlockRepo.save(textBlocks);
  }

  async remove(textBlocks: TextBlock[]): Promise<void> {
    for (const textBlock of textBlocks) {
      await this.textBlockRepo.softRemove(textBlock);
    }
  }
}
