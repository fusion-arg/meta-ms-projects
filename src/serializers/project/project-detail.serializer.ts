import { Project } from '../../modules/project/entities/project.entity';
import { ProjectSerializer } from './project.serializer';

export class ProjectDetailSerializer extends ProjectSerializer {
  serialize(item: Project): any {
    const serializedProject = super.serialize(item);

    return {
      ...serializedProject,
      logo: item.logo,
    };
  }
}
