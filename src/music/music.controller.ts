import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoggedInUser } from 'src/common/decorators/logged-in-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/response/api-response';
import { IPaginationQuery } from 'src/common/response/pagination-data.interface';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { UserEntity, UserRoleEnum } from 'src/users/entities/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicService } from './music.service';

@Controller('music')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @Roles(UserRoleEnum.ARTIST)
  async create(
    @LoggedInUser() user: UserEntity,
    @Body() createMusicDto: CreateMusicDto,
  ) {
    return ApiResponse.success(
      await this.musicService.create(user, createMusicDto),
    );
  }

  @Get()
  @Roles(
    UserRoleEnum.ARTIST,
    UserRoleEnum.ARTIST_MANAGER,
    UserRoleEnum.SUPER_ADMIN,
  )
  async findAll(@LoggedInUser() user: UserEntity, @Query() query: any) {
    return ApiResponse.pagination(
      await this.musicService.findAll(user, query),
      query as IPaginationQuery,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ApiResponse.success(await this.musicService.findOne(+id));
  }

  @Patch(':id')
  @Roles(UserRoleEnum.ARTIST)
  async update(
    @LoggedInUser() user: UserEntity,
    @Param('id') id: string,
    @Body() updateMusicDto: UpdateMusicDto,
  ) {
    return ApiResponse.success(
      await this.musicService.update(user, +id, updateMusicDto),
    );
  }

  @Delete(':id')
  @Roles(UserRoleEnum.ARTIST)
  async remove(@LoggedInUser() user: UserEntity, @Param('id') id: string) {
    return ApiResponse.success(await this.musicService.remove(user, +id));
  }
}
