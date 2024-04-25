import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { Spc } from 'src/modules/spc/entities/spc.entity';
import { SpcController } from './spc.controller';
import { SpcService } from './spc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spc])],
  controllers: [SpcController],
  providers: [SpcService],
})
export class SpcModule {}
