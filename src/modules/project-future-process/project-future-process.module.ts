import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { ProjectFutureProcess } from './entities/project-future-process.entity';
import { ProjectFutureProcessService } from './project-future-process.service';
import { ProjectFutureProcessController } from './project-future-process.controller';
import { Project } from '../project/entities/project.entity';
import { ApiServiceModule } from '../../api-service/api-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectFutureProcess, Project]),
    ApiServiceModule,
  ],
  controllers: [ProjectFutureProcessController],
  providers: [ProjectFutureProcessService],
})
export class ProjectFutureProcessModule {}
