import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserGenderEnum, UserRoleEnum } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dob: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender: UserGenderEnum;

  @IsOptional()
  address: string;
}
