import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(64, { message: 'Username is too long' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @IsEmail({}, { message: 'Email should be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Password is too short' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  // ОПЦИОНАЛЬНО
  @IsString()
  @MaxLength(200, { message: 'About is too long' })
  @IsOptional()
  about?: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
    },
    { message: 'Avatar should be a valid URL' },
  )
  @IsOptional()
  avatar?: string;
}
