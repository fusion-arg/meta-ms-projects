import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectService } from 'src/modules/project/project.service';

@Injectable()
export class ProjectAclMiddleware implements NestMiddleware {
  constructor(private readonly projectService: ProjectService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const projectId = req.params.id;
    const userId = req['user']?.id;
    const isAdmin = req['user']?.isAdmin;

    if (isAdmin) {
      return next();
    }

    if (!projectId || !userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid request parameters',
        },
      });
    }

    const userBelongToProject = await this.projectService.userBelongToProject(
      projectId,
      userId,
    );

    if (!userBelongToProject) {
      return res.status(HttpStatus.FORBIDDEN).json({
        status: HttpStatus.FORBIDDEN,
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'User does not have access to this project',
        },
      });
    }

    next();
  }
}
