import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ClientModule } from '../client/client.module';
import { ProjectFutureProcess } from '../project-future-process/entities/project-future-process.entity';
import { FutureProcess } from './entities/future-process.entity';
import { Spc } from '../spc/entities/spc.entity';
import { ProjectUserRole } from 'src/modules/project-role/entities/project-user-role.entity';
import { ProjectRole } from 'src/modules/project-role/entities/project-role.entity';
import { ProjectAclMiddleware } from 'src/middlewares/project-acl.middleware';
import { TextBlockModule } from '../text-block/text-block.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      FutureProcess,
      ProjectFutureProcess,
      Spc,
      ProjectUserRole,
      ProjectRole,
    ]),
    ClientModule,
    TextBlockModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectAclMiddleware).forRoutes('projects/:id*');
  }
}
