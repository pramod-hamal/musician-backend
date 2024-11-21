import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { MusicGenreEnum } from '../entities/music.entity';

export class CreateMusicDto {
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @Matches(/^(?!\s*$).+/, { message: 'Title cannot be empty or spaces only' })
  title: string;

  @IsNotEmpty({ message: 'Album name cannot be empty' })
  @IsString({ message: 'Album name must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @Matches(/^(?!\s*$).+/, { message: 'Title cannot be empty or spaces only' })
  album_name: string;

  @IsNotEmpty({ message: 'Genre cannot be empty' })
  @IsEnum(MusicGenreEnum)
  genre: MusicGenreEnum;
}
