import { Module } from '@nestjs/common';
import { TextBlockController } from './text-block.controller';
import { TextBlockService } from './text-block.service';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { TextBlock } from './entities/text-block.entity';
import { Tag } from '../tag/entities/tag.entity';
import { Project } from '../project/entities/project.entity';
import { Category } from '../category/entities/category.entity';
import { TextBlockBank } from './entities/text-block-bank.entity';
import { TextBlockReference } from './entities/text-block-reference.entity';
import { ApiServiceModule } from '../../api-service/api-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TextBlock,
      Tag,
      Project,
      Category,
      TextBlockBank,
      TextBlockReference,
    ]),
    ApiServiceModule,
  ],
  controllers: [TextBlockController],
  providers: [TextBlockService],
  exports: [TextBlockService],
})
export class TextBlockModule {}
