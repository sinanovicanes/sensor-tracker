import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto);
    const savedUser = await this.userRepo.save(user);

    this.eventEmitter.emit('user.created', savedUser);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const result = await this.userRepo.update(id, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.findOne(id);

    if (!!updatedUser) {
      this.eventEmitter.emit('user.updated', updatedUser);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.eventEmitter.emit('user.deleted', id);
  }
}
