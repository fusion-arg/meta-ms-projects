import { BaseSerializer } from './base.serializer';
import { QuestionBank } from '../modules/question-bank/entities/question-bank.entity';

export class QuestionBankSerializer extends BaseSerializer<QuestionBank> {
  serialize(item: QuestionBank): any {
    const industry = item.industry
      ? {
          id: item.industry.id,
          name: item.industry.name,
        }
      : null;
    const category = item.category
      ? {
          id: item.category.id,
          name: item.category.name,
        }
      : null;
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      dropdownOptions: item.options,
      industry,
      category,
    };
  }
}
