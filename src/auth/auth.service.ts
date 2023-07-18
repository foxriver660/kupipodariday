import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupResponseDto } from './dto/response-dto/signup-response.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const savedUser = await this.usersRepository.save(createUserDto);
      const { id, username, email, about, avatar, createdAt, updatedAt } =
        savedUser;
      const signupResponseDto: SignupResponseDto = {
        id,
        username,
        email,
        about,
        avatar,
        createdAt,
        updatedAt,
      };
      return signupResponseDto;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          `User with same username or email already exists`,
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async validateUser({ username, password }: SigninUserDto) {
    const user = await this.usersRepository.findOneBy({
      username,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
