import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/contracts/pagination.contract';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { EntityManager, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectSorting } from '../../helpers/sortings/project.sorting';
import { ProjectFilter } from '../../helpers/filters/project.filter';
import { FilterService } from '../../helpers/services/filter.service';
import { ClientService } from '../client/client.service';
import { CreateProjectData } from '../../data/project/create-project.data';
import { UpdateProjectData } from '../../data/project/update-project.data';
import { ProjectFutureProcess } from '../project-future-process/entities/project-future-process.entity';
import { FutureProcess } from './entities/future-process.entity';
import { Spc } from '../spc/entities/spc.entity';
import { v4 as uuidv4 } from 'uuid';
import { ProjectUserRole } from 'src/modules/project-role/entities/project-user-role.entity';
import { UserRoleAssignmentData } from 'src/data/project/user-role-assignment.data';
import axios from 'axios';
import { ProjectRole } from 'src/modules/project-role/entities/project-role.entity';
import { UserProjectAssignmentData } from '../../data/project/user-project-assignment.data';
import { TextBlockService } from '../text-block/text-block.service';

@Injectable()
export class ProjectService extends PaginationService {
  constructor(
    @Inject(ClientService)
    private readonly clientService: ClientService,
    @InjectRepository(ProjectFutureProcess)
    private projectFutureProcessRepository: Repository<ProjectFutureProcess>,
    @InjectRepository(Spc)
    private spcRepository: Repository<Spc>,
    @InjectRepository(FutureProcess)
    private futureProcessRepository: Repository<FutureProcess>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(ProjectUserRole)
    private projectUserRoleRepository: Repository<ProjectUserRole>,
    @InjectRepository(ProjectRole)
    private projectRoleRepository: Repository<ProjectRole>,
    @Inject(TextBlockService)
    private readonly textBlockService: TextBlockService,
  ) {
    super();
  }

  async filter(
    filter: ProjectFilter,
    sorting: ProjectSorting,
    pagination: Pagination,
    user: any,
  ) {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.client', 'c')
      .innerJoinAndSelect('c.industry', 'i');

    if (!user.isAdmin) {
      queryBuilder
        .innerJoin(
          'project.projectUserRoles',
          'pur',
          'pur.project = project.id',
        )
        .andWhere('pur.userId = :userId', { userId: user.id });
    }

    FilterService.applyFilters(queryBuilder, filter);
    this.applySorting(queryBuilder, sorting);
    return await this.paginate(queryBuilder, pagination);
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    sorting: ProjectSorting,
  ): void {
    const { name, client, startDate, dueDate, industry, createdAt } = sorting;

    if (name) {
      queryBuilder.addOrderBy('project.name', name);
    }

    if (client) {
      queryBuilder.addOrderBy('c.name', client);
    }

    if (startDate) {
      queryBuilder.addOrderBy('project.startDate', startDate);
    }

    if (dueDate) {
      queryBuilder.addOrderBy('project.dueDate', dueDate);
    }

    if (industry) {
      queryBuilder.addOrderBy('i.name', industry);
    }

    if (createdAt) {
      queryBuilder.addOrderBy('project.createdAt', createdAt);
    }
  }

  async create(
    data: CreateProjectData,
    userId: string,
    userName: string,
  ): Promise<Project> {
    const { startDate, dueDate, logo, name, client } = data;

    this.validateDueDate(startDate, dueDate);

    const clientEntity = await this.clientService.create({ ...client });
    const newProject = this.projectRepository.create({
      id: uuidv4(),
      name,
      startDate,
      dueDate,
      logo,
      client: clientEntity,
    });
    await this.projectRepository.save(newProject);
    await this.assignUser(newProject.id, userId);
    await this.createFutureProcess(newProject, null, null);
    await this.textBlockService.assignTextBlockBank(newProject, userName);
    return newProject;
  }

  private async createFutureProcess(
    project: Project,
    parent: FutureProcess | null = null,
    projectFutureProcess: ProjectFutureProcess | null = null,
  ) {
    const whereCondition = parent
      ? { industry: project.client.industry, parent: { id: parent.id } }
      : { industry: project.client.industry, parent: IsNull() };

    const futureProcessList = await this.futureProcessRepository.find({
      where: whereCondition,
      relations: ['spc'],
    });
    for (const ft of futureProcessList) {
      const newProjectFutureProcess =
        this.projectFutureProcessRepository.create({
          id: uuidv4(),
          spcName: ft.spc.name,
          futureProcessName: ft.name,
          code: ft.code,
          parent: projectFutureProcess,
          project,
          visibleCode: ft.spc.visibleCode,
        });
      await this.projectFutureProcessRepository.save(newProjectFutureProcess);
      await this.createFutureProcess(project, ft, newProjectFutureProcess);
    }
  }

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    this.validateDueDate(data.startDate, data.dueDate);

    const { client } = data;
    const projectEntity = await this.findProjectById(id);
    const clientEntity = projectEntity.client;

    Object.assign(projectEntity, data);
    await this.clientService.update(clientEntity.id, client);
    await this.projectRepository.save(projectEntity);
    return await this.findProjectById(id);
  }

  async findProjectById(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'client.industry'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project;
  }

  private validateDueDate(startDate: Date, dueDate: Date): void {
    if (startDate > dueDate) {
      throw new BadRequestException(
        'DueDate must be greater than or equal to startDate',
      );
    }
  }

  async remove(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['textBlocks'],
    });

    if (!project) {
      throw new NotFoundException('project not found');
    }
    await this.textBlockService.remove(project.textBlocks);
    return this.projectRepository.softRemove(project);
  }

  async assignUser(
    projectId: string,
    userId: string,
  ): Promise<ProjectUserRole> {
    const existingAssignment = await this.projectUserRoleRepository.findOneBy({
      project: { id: projectId },
      userId,
    });

    if (existingAssignment) {
      throw new BadRequestException(
        'The user has already been assigned to this project.',
      );
    }

    const item = this.projectUserRoleRepository.create({
      id: uuidv4(),
      userId: userId,
      project: { id: projectId },
    });

    await this.projectUserRoleRepository.save(item);

    return item;
  }

  async assignStakeHolderUser(
    projectId: string,
    stakeholdersIds: UserProjectAssignmentData[],
  ): Promise<void> {
    try {
      const projectUserRole: ProjectUserRole[] = [];
      await this.projectFutureProcessRepository.manager.transaction(
        async (manager: EntityManager) => {
          for (const user of stakeholdersIds) {
            const existingAssignment = await manager
              .getRepository(ProjectUserRole)
              .findOneBy({
                project: { id: projectId },
                userId: user.userId,
              });
            if (!existingAssignment) {
              const item = manager.getRepository(ProjectUserRole).create({
                id: uuidv4(),
                userId: user.userId,
                project: { id: projectId },
              });
              projectUserRole.push(item);
            }
          }
          await manager.getRepository(ProjectUserRole).save(projectUserRole);
        },
      );
    } catch (error) {
      Logger.error(error, 'Error -> assignUserToProject');
      throw new BadRequestException(error);
    }
  }

  async unassignUser(projectId: string, userId: string) {
    const existingAssignment = await this.projectUserRoleRepository.findOneBy({
      project: { id: projectId },
      userId,
    });

    if (!existingAssignment) {
      throw new BadRequestException(
        'The user is not assigned to this project.',
      );
    }

    return await this.projectUserRoleRepository.softRemove(existingAssignment);
  }

  async assignUserRole(projectId: string, data: UserRoleAssignmentData) {
    const item = await this.projectUserRoleRepository.findOneBy({
      userId: data.userId,
      project: { id: projectId },
    });

    const projectRole = await this.projectRoleRepository.findOneBy({
      id: data.projectRole,
    });

    if (!item || !projectRole) {
      throw new BadRequestException('The item does not exists');
    }

    item.projectRole = projectRole;

    await this.projectUserRoleRepository.save(item);
  }

  async listUsers(projectId: string, accessToken: string) {
    const projectUsers = await this.projectUserRoleRepository.find({
      where: { project: { id: projectId } },
      relations: ['projectRole'],
    });

    const userIds = projectUsers.map((user) => user.userId);
    const projectRoles = projectUsers.reduce((acc, user) => {
      acc[user.userId] = user.projectRole
        ? { id: user.projectRole.id, name: user.projectRole.name }
        : null;
      return acc;
    }, {});

    const response = await axios.post(
      `${process.env.META_AUTH_URL}/meta-users/projects/list`,
      { userIds },
      {
        headers: {
          Authorization: accessToken,
        },
      },
    );
    const users = response.data;

    const decoratedResponse = {
      selected: [],
      unselected: users.unselected,
    };

    for (const user of users.selected) {
      const projectRole = projectRoles[user.id];
      decoratedResponse.selected.push({
        ...user,
        projectRole,
      });
    }

    return decoratedResponse;
  }

  async userBelongToProject(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    const projectUserRole = await this.projectUserRoleRepository.findOne({
      where: { project: { id: projectId }, userId },
    });

    return !!projectUserRole;
  }
}
