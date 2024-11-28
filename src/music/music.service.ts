import { Injectable } from '@nestjs/common';
import { UserEntity, UserRoleEnum } from 'src/users/entities/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicFactoryService } from './music.factory.service';
import { MusicRepository } from './music.repository';
import AppException from 'src/common/error/app.exception';
import { IPaginationData } from 'src/common/response/pagination-data.interface';

@Injectable()
export class MusicService {
  constructor(
    private readonly musicFactoryService: MusicFactoryService,
    private readonly _repository: MusicRepository,
  ) {}
  async create(user: UserEntity, createMusicDto: CreateMusicDto) {
    const music = this.musicFactoryService.createMusic(user, createMusicDto);
    const result = await this._repository.create(music);
    music.id = result.insertId;
    return music;
  }

  async findAll(user: UserEntity, query: any): Promise<IPaginationData> {
    const { page, limit } = query;
    if (user.role === UserRoleEnum.ARTIST) {
      return await this._repository.findAll({ user_id: user.id }, page, limit);
    }

    let condition = {};
    if (query.artistId && query.artistId != 'undefined') {
      condition = { user_id: query.artistId };
    }
    return await this._repository.findAll(condition, page, limit);
  }

  async findOne(id: number) {
    return await this._repository.findOne({ id });
  }

  async update(user: UserEntity, id: number, updateMusicDto: UpdateMusicDto) {
    if (user.role !== UserRoleEnum.ARTIST)
      throw new AppException({}, 'Forbidden', 403);
    const music = await this._repository.findOne({ id, user_id: user.id });
    if (!music) {
      throw new AppException({}, 'Music not found', 404);
    }
    const updated = this.musicFactoryService.updateMusic(music, updateMusicDto);
    await this._repository.update({ id }, updated);
    return updated;
  }

  async remove(user: UserEntity, id: number) {
    if (user.role !== UserRoleEnum.ARTIST)
      throw new AppException({}, 'Forbidden', 403);
    const music = await this._repository.findOne({ id, user_id: user.id });
    if (!music) {
      throw new AppException({}, 'Music not found', 404);
    }
    await this._repository.remove({ id });
    return music;
  }
}
