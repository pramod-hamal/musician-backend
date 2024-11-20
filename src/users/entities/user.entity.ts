export class UserEntity {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: UserGenderEnum;
  role: UserRoleEnum;
  address: string;
  created_at: string;
  updated_at: string;
}

export enum UserRoleEnum {
  SUPER_ADMIN = 'super_admin',
  ARTIST_MANAGER = 'artist_manager',
  ARTIST = 'artist',
}

export enum UserGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}
