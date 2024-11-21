import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggedInUser } from 'src/common/decorators/logged-in-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/response/api-response';
import { IPaginationData } from 'src/common/response/pagination-data.interface';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserRoleEnum } from './entities/user.entity';
import { UsersService } from './users.service';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return ApiResponse.success(await this.usersService.create(createUserDto));
  }

  @Get()
  async findAll(@Query() query: any) {
    return ApiResponse.pagination(
      (await this.usersService.findAll(query)) as IPaginationData,
      query,
    );
  }

  @Get('/artists')
  async findArtists(@Query() query: any, @LoggedInUser() user: UserEntity) {
    return ApiResponse.pagination(
      (await this.usersService.findArtists(user, query)) as IPaginationData,
      query,
    );
  }

  @Post('/import/artists')
  @UseInterceptors(FileInterceptor('file'))
  async importArtists(@UploadedFile() file: Express.Multer.File) {
    return 'llls';
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ApiResponse.success(await this.usersService.findOne(+id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return ApiResponse.success(
      await this.usersService.update(+id, updateUserDto),
    );
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return ApiResponse.success(await this.usersService.remove(+id));
  }
}
