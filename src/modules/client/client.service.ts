import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientData } from '../../data/create-client.data';
import { Industry } from '../industry/entities/industry.entity';

@Injectable()
export class ClientService extends PaginationService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Industry)
    private industryRepository: Repository<Industry>,
  ) {
    super();
  }

  async findClient(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['industry'],
    });
    if (!client) {
      throw new NotFoundException('client not found');
    }
    return client;
  }

  async all() {
    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .innerJoinAndSelect('client.industry', 'i');

    queryBuilder.addOrderBy('client.name', 'ASC');

    return await queryBuilder.getMany();
  }

  async update(id: string, data: CreateClientData) {
    return await this.clientRepository.update(id, {
      name: data.name,
      licensing: data.licenseInformation,
    });
  }

  async create(data: CreateClientData) {
    const { industry, ...clientData } = data;

    const industryEntity = await this.industryRepository.findOneBy({
      id: industry,
    });
    if (!industryEntity) {
      throw new NotFoundException('industry not found');
    }

    const newClient = this.clientRepository.create({
      name: clientData.name,
      licensing: clientData.licenseInformation,
      industry: industryEntity,
    });
    return await this.clientRepository.save(newClient);
  }
}
