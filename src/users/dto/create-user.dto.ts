import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

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
}
