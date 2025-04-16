import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepo.create(dto);
    const savedCompany = await this.companyRepo.save(company);

    this.eventEmitter.emit('company.created', savedCompany);

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepo.find();
  }

  async findOne(id: string): Promise<Company | null> {
    return this.companyRepo.findOneBy({ id });
  }

  async findOneByName(name: string): Promise<Company | null> {
    return this.companyRepo.findOneBy({ name });
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company | null> {
    const result = await this.companyRepo.update(id, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    const updatedCompany = await this.findOne(id);

    if (!!updatedCompany) {
      this.eventEmitter.emit('company.updated', updatedCompany);
    }

    return updatedCompany;
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    this.eventEmitter.emit('company.deleted', id);
  }
}
