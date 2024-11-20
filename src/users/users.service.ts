import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './user.repository';
import AppException from 'src/common/error/app.exception';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(query: any) {
    return await this.usersRepository.findAll({}, query.page, query.limit);
  }

  async findOne(id: number) {
    const data = await this.usersRepository.findOne({ id: id });
    if (!data) {
      throw new AppException({}, 'User not found', 404);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
