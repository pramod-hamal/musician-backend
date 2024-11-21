import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersRepository } from 'src/users/user.repository';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import AppException from 'src/common/error/app.exception';
import { IPasswordHashService } from 'src/common/password-hash/password-hash.interface';
import { IAccessTokenGenerator } from 'src/common/access-token-generator/access-token-generator.interface';

@Injectable()
export class AuthService {
  constructor(
    // private readonly userFactoryService: UserFactoryService,
    private readonly userRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly hashService: IPasswordHashService,
    private readonly tokenService: IAccessTokenGenerator,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      throw new AppException({}, 'Invalid Email/password', 400);
    }

    const isPasswordValid = await this.hashService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppException({}, 'Invalid Email/password', 400);
    }

    return {
      token: await this.tokenService.generate(user.id),
      user,
    };
  }
  async register(dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }
}
