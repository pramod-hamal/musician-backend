import { Injectable } from '@nestjs/common';
import { IPasswordHashService } from 'src/common/password-hash/password-hash.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserFactoryService {
  constructor(private readonly hashGenerator: IPasswordHashService) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userEntity = new UserEntity();
    userEntity.email = dto.email;
    userEntity.password = dto.password;
    userEntity.first_name = dto.first_name;
    userEntity.last_name = dto.last_name;
    userEntity.phone = dto.phone;
    userEntity.password = await this.hashGenerator.hash(dto.password);
    userEntity.dob = dto.dob;
    userEntity.role = dto.role;
    return userEntity;
  }

  async updateUser(
    userEntity: UserEntity,
    dto: UpdateUserDto | CreateUserDto,
  ): Promise<UserEntity> {
    if (dto.password) userEntity.password = dto.password;
    if (dto.first_name) userEntity.first_name = dto.first_name;
    if (dto.last_name) userEntity.last_name = dto.last_name;
    if (dto.phone) userEntity.phone = dto.phone;
    if (dto.password)
      userEntity.password = await this.hashGenerator.hash(dto.password);
    if (dto.dob) userEntity.dob = dto.dob;
    return userEntity;
  }
}
