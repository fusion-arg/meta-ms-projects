import { Module } from '@nestjs/common';
import { IndustryController } from './industry.controller';
import { IndustryService } from './industry.service';
import { Industry } from 'src/modules/industry/entities/industry.entity';
import { TypeOrmModule } from '../typeorm/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  controllers: [IndustryController],
  providers: [IndustryService],
})
export class IndustryModule {}
