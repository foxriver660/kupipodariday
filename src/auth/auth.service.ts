import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupResponseDto } from './dto/response-dto/signup-response.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const salt = await genSalt(10);
      const newUser = {
        ...createUserDto,
        password: await hash(createUserDto.password, salt),
      };
      const savedUser = await this.usersRepository.save(newUser);
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
      throw new UnauthorizedException(
        '[U]Authorization error, please check the correctness of the data entered',
      );
    }
    const isValidPassword = await compare(password, user.password);
    if (isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  // JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
