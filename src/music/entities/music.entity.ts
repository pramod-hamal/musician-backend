export class MusicEntity {
  id: number;
  user_id: number;
  title: string;
  album_name: string;
  genre: MusicGenreEnum;
  created_at: Date;
  updated_at: Date;
}

export enum MusicGenreEnum {
  RNB = 'RnB',
  COUNTRY = 'Country',
  CLASSIC = 'Classic',
  JAZZ = 'Jazz',
  ROCK = 'Rock',
}
