import { Module } from '@nestjs/common';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './question-bank.service';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { QuestionBank } from './entities/question-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionBank])],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
