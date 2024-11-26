import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, unlink } from 'fs';
import { LoggedInUser } from 'src/common/decorators/logged-in-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/response/api-response';
import { IPaginationData } from 'src/common/response/pagination-data.interface';
import { ArtistCsvService } from './csv-module/artist-csv.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserRoleEnum } from './entities/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import AppException from 'src/common/error/app.exception';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly artistCsvService: ArtistCsvService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ARTIST_MANAGER)
  async create(
    @Body() createUserDto: CreateUserDto,
    @LoggedInUser() user: UserEntity,
  ) {
    if (
      user.role === UserRoleEnum.ARTIST_MANAGER &&
      createUserDto.role !== UserRoleEnum.ARTIST
    )
      throw new AppException({}, 'Only Artist Manager can create Artist', 403);
    return ApiResponse.success(await this.usersService.create(createUserDto));
  }

  @Get()
  @Roles(UserRoleEnum.SUPER_ADMIN)
  async findAll(@Query() query: any) {
    return ApiResponse.pagination(
      (await this.usersService.findAll(query)) as IPaginationData,
      query,
    );
  }

  @Get('/artists')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ARTIST_MANAGER)
  async findArtists(@Query() query: any, @LoggedInUser() user: UserEntity) {
    return ApiResponse.pagination(
      (await this.usersService.findArtists(user, query)) as IPaginationData,
      query,
    );
  }

  @Post('/import/artists')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ARTIST_MANAGER)
  @UseInterceptors(FileInterceptor('file'))
  async importArtists(@UploadedFile() file: Express.Multer.File) {
    await this.artistCsvService.importCsv(file.buffer);
    return ApiResponse.success('Artist Imported successfully');
  }
  @Get('/export/artists')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ARTIST_MANAGER)
  async exportArtists(@Res({ passthrough: true }) res: Response) {
    const filePath = await this.artistCsvService.exportCsv();
    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="artists-${Date.now()}.csv"`,
    });

    const streamable = new StreamableFile(file);
    file.on('close', () => {
      unlink(filePath, () => {});
    });
    return streamable;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return ApiResponse.success(await this.usersService.findOne(+id));
  }

  @Patch(':id')
  @Roles(UserRoleEnum.ARTIST_MANAGER, UserRoleEnum.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return ApiResponse.success(
      await this.usersService.update(+id, updateUserDto),
    );
  }

  @Delete(':id')
  @Roles(UserRoleEnum.ARTIST_MANAGER, UserRoleEnum.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return ApiResponse.success(await this.usersService.remove(+id));
  }

  @Get('count')
  @Roles(UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ARTIST_MANAGER)
  async count() {
    return ApiResponse.success(await this.usersService.getTotalCount());
  }
}
