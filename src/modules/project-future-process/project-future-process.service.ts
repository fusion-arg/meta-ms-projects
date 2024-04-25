import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, IsNull, Repository } from 'typeorm';
import { ProjectFutureProcess } from './entities/project-future-process.entity';
import { SelectedProjectFutureProcessData } from 'src/data/project-future-process/selected-project-future-process.data';
import { Project } from '../project/entities/project.entity';
import { CreateProjectFutureProcessData } from '../../data/project-future-process/create-project-future-process.data';
import { v4 as uuidv4 } from 'uuid';
import { ProcessType } from '../../helpers/enum/processType';
import { ApiProcessService } from '../../api-service/api-process.service';
import { SelectedFutureProcessData } from '../../data/api-process/selected-future-process.data';
import { FutureProcessData } from '../../data/api-process/future-process.data';

class parent {
  id: string;
  futureProcessName: string;
  spcName: string;
}
class TreeNode {
  id: string;
  futureProcessName: string;
  spcName: string;
  code: string;
  branchCode: string;
  parent?: parent;
  isSelected: boolean;
  canBeDeleted: boolean;
  subProcesses?: TreeNode[];
}

@Injectable()
export class ProjectFutureProcessService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(ProjectFutureProcess)
    private projectFutureProcessRepository: Repository<ProjectFutureProcess>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @Inject(ApiProcessService)
    private readonly apiService: ApiProcessService,
  ) {}

  async create(
    data: CreateProjectFutureProcessData,
  ): Promise<ProjectFutureProcess> {
    const { projectId, name, type, parent, code, visibleCode } = data;
    const project = await this.getProjectById(projectId);

    await this.checkIfCodeIsInUse(project, visibleCode);
    const parentEntity =
      type === ProcessType.spc
        ? null
        : await this.getOneProjectFutureProcess(parent, project);

    const newProjectFutureProcess = this.projectFutureProcessRepository.create({
      id: uuidv4(),
      spcName: name,
      futureProcessName: name,
      code,
      parent: parentEntity,
      project,
      visibleCode,
      isDeletable: true,
      isCreatedManual: true,
    });
    await this.projectFutureProcessRepository.save(newProjectFutureProcess);
    if (parentEntity?.isDeletable) {
      parentEntity.isDeletable = false;
      await this.projectFutureProcessRepository.save(parentEntity);
    }
    return newProjectFutureProcess;
  }

  private async checkIfCodeIsInUse(
    project: Project,
    visibleCode: string,
  ): Promise<void> {
    const projectFutureProcessEntity =
      await this.projectFutureProcessRepository.findOne({
        where: { visibleCode: visibleCode, project: { id: project.id } },
      });

    if (projectFutureProcessEntity) {
      throw new ConflictException('The code is already in use.');
    }
  }
  private async getProjectById(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  private async getOneProjectFutureProcess(
    parent: string,
    project: Project,
  ): Promise<ProjectFutureProcess | null> {
    const projectFutureProcess =
      await this.projectFutureProcessRepository.findOne({
        where: { id: parent, project: { id: project.id } },
      });

    if (!projectFutureProcess) {
      throw new NotFoundException('Project future process not found');
    }
    return projectFutureProcess;
  }

  async updateSelection(data: SelectedProjectFutureProcessData, token: string) {
    const { projectId, selected, unselected, deleted } = data;

    try {
      await this.projectFutureProcessRepository.manager.transaction(
        async (manager) => {
          await this.validateItemIds(manager, projectId, [
            ...selected,
            ...unselected,
            ...deleted,
          ]);

          await this.updateSelectionStatus(manager, selected, true);
          await this.updateSelectionStatus(manager, unselected, false);

          const mappedResultsDeleted = await this.deleteItems(
            manager,
            deleted,
            projectId,
          );
          const itemsSelected = await this.getItemsSelected(manager, [
            ...selected,
            ...unselected,
          ]);
          const mappedResults = this.mapItems(itemsSelected);

          await this.apiService.selectedFutureProcess(
            projectId,
            [...mappedResults, ...mappedResultsDeleted],
            token,
          );
        },
      );
    } catch (error) {
      Logger.error(error, 'Error -> updateSelection');
      throw new BadRequestException(error);
    }
  }

  private async deleteItems(
    manager: EntityManager,
    deleted: string[],
    projectId: string,
  ) {
    if (deleted.length === 0) return [];

    await this.softDelete(manager, deleted);
    const itemsDeleted = await this.setDeletableParent(
      manager,
      deleted,
      projectId,
    );
    const mappedResultsDeleted = this.mapItems(itemsDeleted);
    return mappedResultsDeleted;
  }

  private async getItemsSelected(
    queryRunner: EntityManager,
    selected: string[],
  ): Promise<ProjectFutureProcess[]> {
    if (selected.length === 0) return [];
    return await queryRunner
      .getRepository(ProjectFutureProcess)
      .createQueryBuilder('project_future_process')
      .where('project_future_process.id IN (:...selected)', { selected })
      .leftJoinAndSelect('project_future_process.project', 'project')
      .leftJoinAndSelect('project_future_process.parent', 'parent')
      .orderBy('project_future_process.code', 'ASC')
      .getMany();
  }

  private mapItems(
    itemsSelected: ProjectFutureProcess[],
  ): SelectedFutureProcessData[] {
    return itemsSelected.map((item) => ({
      futureProcessId: item.id,
      code: item.code,
      visibleCode: item.visibleCode,
      projectId: item.project.id,
      spcName: item.spcName,
      futureProcessName: item.futureProcessName,
      parent: item.parent?.id || null,
      isSelected: item.isSelected,
    }));
  }
  private async setDeletableParent(
    queryRunner: EntityManager,
    deleted: any[],
    projectId: string,
  ) {
    const itemsDeleted = await queryRunner
      .getRepository(ProjectFutureProcess)
      .createQueryBuilder('project_future_process')
      .where(
        'project_future_process.id IN (:...ids) AND project_future_process.project_id = :projectId',
        {
          ids: deleted,
          projectId,
        },
      )
      .innerJoinAndSelect('project_future_process.parent', 'parent')
      .innerJoinAndSelect('project_future_process.project', 'project')
      .withDeleted()
      .getMany();

    for (const item of itemsDeleted) {
      const activeChild = await queryRunner
        .getRepository(ProjectFutureProcess)
        .findOne({
          where: {
            parent: { id: item.parent.id },
            isCreatedManual: true,
          },
        });
      if (!activeChild && item.parent.isCreatedManual) {
        await await queryRunner
          .getRepository(ProjectFutureProcess)
          .update(item.parent.id, {
            isDeletable: true,
          });
      }
    }
    return itemsDeleted;
  }

  private async validateItemIds(
    queryRunner: EntityManager,
    projectId: string,
    itemIds: string[],
  ) {
    const invalidItems = await queryRunner
      .getRepository(ProjectFutureProcess)
      .createQueryBuilder()
      .where('id IN (:...ids) AND project_id != :projectId', {
        ids: itemIds,
        projectId,
      })
      .getMany();

    if (invalidItems.length > 0) {
      throw new ForbiddenException(
        'Not all item IDs belong to the provided project',
      );
    }
  }

  private async updateSelectionStatus(
    queryRunner: EntityManager,
    items: string[],
    isSelected: boolean,
  ) {
    if (items && items.length > 0) {
      await queryRunner
        .getRepository(ProjectFutureProcess)
        .createQueryBuilder()
        .update(ProjectFutureProcess)
        .set({ isSelected })
        .where('id IN (:...ids)', { ids: items })
        .execute();
    }
  }

  private async softDelete(queryRunner: EntityManager, items: string[]) {
    const deletableItems = await queryRunner
      .getRepository(ProjectFutureProcess)
      .find({
        where: { id: In(items), isDeletable: true },
      });

    if (deletableItems.length !== items.length) {
      throw new ConflictException('Not all items are deletable');
    }

    await queryRunner
      .getRepository(ProjectFutureProcess)
      .softRemove(deletableItems);
  }
  async findFutureProcess(projectId: string): Promise<TreeNode[]> {
    const project = await this.getProjectById(projectId);
    return await this.getProjectFutureProcess(project, null);
  }

  private async getProjectFutureProcess(
    project: Project,
    parent: ProjectFutureProcess | null = null,
  ): Promise<TreeNode[]> {
    const whereCondition = parent
      ? { parent: { id: parent.id, project: { id: project.id } } }
      : { parent: IsNull(), project: { id: project.id } };

    const futureProcessList = await this.projectFutureProcessRepository.find({
      where: whereCondition,
      order: { code: 'ASC' },
    });

    const tree: TreeNode[] = [];

    for (const ft of futureProcessList) {
      const treeNode: TreeNode = {
        id: ft.id,
        code: ft.code,
        spcName: ft.spcName,
        futureProcessName: ft.futureProcessName,
        branchCode: ft.visibleCode,
        isSelected: ft.isSelected,
        canBeDeleted: ft.isDeletable,
        parent: parent
          ? {
              id: parent.id,
              spcName: parent.spcName,
              futureProcessName: parent.futureProcessName,
            }
          : null,
      };

      const children = await this.getProjectFutureProcess(project, ft);
      if (children.length > 0) {
        treeNode.subProcesses = children;
      }

      tree.push(treeNode);
    }
    return tree;
  }

  async setUnSelectedFutureProcess(projectId: string, data: FutureProcessData) {
    const projectFutureProcessEntity =
      await this.projectFutureProcessRepository.findOne({
        where: { id: data.id, project: { id: projectId } },
      });

    if (!projectFutureProcessEntity) {
      throw new NotFoundException('Project future process not found');
    }
    await this.projectFutureProcessRepository.update(
      projectFutureProcessEntity.id,
      {
        canBeUnselected: true,
      },
    );
  }
}
