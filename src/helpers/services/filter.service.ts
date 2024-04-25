import { SelectQueryBuilder } from 'typeorm';

export class FilterService {
  static applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    filters: { [key: string]: any },
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.applyFilter(queryBuilder, key, value);
      }
    });
  }

  private static applyFilter(
    queryBuilder: SelectQueryBuilder<any>,
    key: string,
    value: any,
  ): void {
    switch (key) {
      case 'name':
        this.applyLikeFilter(queryBuilder, 'project.name', value);
        break;
      case 'client':
        this.applyLikeFilter(queryBuilder, 'c.name', value);
        break;
      case 'industries':
        this.applyInFilter(queryBuilder, 'i.id', value);
        break;
      case 'startDateFrom':
        this.applyGreaterThanOrEqualFilter(
          queryBuilder,
          'project.startDate',
          value,
        );
        break;
      case 'startDateTo':
        this.applyLessThanOrEqualFilter(
          queryBuilder,
          'project.startDate',
          value,
        );
        break;
      case 'dueDateFrom':
        this.applyGreaterThanOrEqualFilter(
          queryBuilder,
          'project.dueDate',
          value,
        );
        break;
      case 'dueDateTo':
        this.applyLessThanOrEqualFilter(queryBuilder, 'project.dueDate', value);
        break;
      case 'createdAtFrom':
        this.applyGreaterThanOrEqualFilter(
          queryBuilder,
          'project.createdAt',
          value,
        );
        break;
      case 'createdAtTo':
        this.applyLessThanOrEqualFilter(
          queryBuilder,
          'project.createdAt',
          value,
        );
        break;
    }
  }

  private static applyLikeFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: string,
  ): void {
    queryBuilder.andWhere(`${field} LIKE :likeValue`, {
      likeValue: `%${value}%`,
    });
  }

  private static applyInFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: any[],
  ): void {
    queryBuilder.andWhere(`${field} IN (:...values)`, { values: value });
  }

  private static applyGreaterThanOrEqualFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: Date,
  ): void {
    queryBuilder.andWhere(`${field} >= :valueGT`, { valueGT: value });
  }

  private static applyLessThanOrEqualFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: Date,
  ): void {
    queryBuilder.andWhere(`${field} <= :valueLT`, { valueLT: value });
  }
}
