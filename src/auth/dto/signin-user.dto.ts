import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class SigninUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(1, { message: 'Username should not be empty' })
  @MaxLength(64, { message: 'Username is too long' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @IsString()
  @MinLength(2, { message: 'Password is too short' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
