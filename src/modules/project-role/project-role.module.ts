import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { ProjectRoleController } from './project-role.controller';
import { ProjectRoleService } from './project-role.service';
import { ProjectRole } from 'src/modules/project-role/entities/project-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRole])],
  controllers: [ProjectRoleController],
  providers: [ProjectRoleService],
})
export class ProjectRoleModule {}
