import { Injectable } from '@nestjs/common';
import AppException from 'src/common/error/app.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserRoleEnum } from './entities/user.entity';
import { UserFactoryService } from './user.factory.service';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactoryService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      email: createUserDto.email,
    });

    if (user) {
      throw new AppException({}, 'User already exists', 400);
    }

    if (!createUserDto.role) {
      createUserDto.role = UserRoleEnum.ARTIST;
    }
    const userEntity = await this.userFactory.createUser(createUserDto);
    const result = await this.usersRepository.create(userEntity);
    userEntity.id = result.insertId;
    return userEntity;
  }

  async findAll(query: any) {
    return await this.usersRepository.findAll({}, query.page, query.limit);
  }

  async findOne(id: number) {
    const data = await this.usersRepository.findOne({ id: id });
    if (!data) {
      throw new AppException({}, 'User not found', 404);
    }
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userEntity = await this.usersRepository.findOne({ id: id });
    if (!userEntity) {
      throw new AppException({}, 'User not found', 404);
    }
    const updated = await this.userFactory.updateUser(
      userEntity,
      updateUserDto,
    );

    await this.usersRepository.update({ id }, updated);
    return updated;
  }

  async remove(id: number) {
    return this.usersRepository.remove({ id });
  }

  async findArtists(user: UserEntity, query: any) {
    return await this.usersRepository.findAll(
      { role: UserRoleEnum.ARTIST },
      query.page,
      query.limit,
    );
  }
}
