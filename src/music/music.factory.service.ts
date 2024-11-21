import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { MusicEntity } from './entities/music.entity';
import { UpdateMusicDto } from './dto/update-music.dto';

@Injectable()
export class MusicFactoryService {
  constructor() {}

  createMusic(user: UserEntity, dto: CreateMusicDto): MusicEntity {
    const music = new MusicEntity();
    music.title = dto.title;
    music.user_id = user.id;
    music.genre = dto.genre;
    music.album_name = dto.album_name;
    return music;
  }

  updateMusic(music: MusicEntity, dto: UpdateMusicDto): MusicEntity {
    if (dto.title) music.title = dto.title;
    if (dto.genre) music.genre = dto.genre;
    if (dto.album_name) music.album_name = dto.album_name;
    return music;
  }
}
