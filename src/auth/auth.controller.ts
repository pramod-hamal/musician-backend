import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { LoggedInUser } from 'src/common/decorators/logged-in-user.decorator';
import { UserEntity, UserRoleEnum } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: LoginDto) {
    return ApiResponse.success(await this.authService.login(createAuthDto));
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateUserDto) {
    createAuthDto.role = UserRoleEnum.SUPER_ADMIN;
    return ApiResponse.success(await this.authService.register(createAuthDto));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@LoggedInUser() user: UserEntity) {
    return ApiResponse.success(user);
  }
}
