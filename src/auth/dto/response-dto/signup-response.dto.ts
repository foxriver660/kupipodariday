import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(200)
  about: string;

  @IsUrl({
    protocols: ['http', 'https'],
  })
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  password: string;

  @IsNumber()
  id: number;

  @IsDate()
  createdAt: string;

  @IsDate()
  updatedAt: string;
}
