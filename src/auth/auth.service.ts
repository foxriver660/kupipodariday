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
      const genUser = await this.generateUserWithHashPass(createUserDto);
      const savedUser = await this.usersRepository.save(genUser);
      const { password, ...result } = savedUser;
      return result as SignupResponseDto;
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
  async login(user: { username: string; id: string }) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // LOCAL STRATEGY
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
      const { password, email, ...result } = user;
      return result;
    }
    return null;
  }
  // ВСПОМОГАТЕЛЬНЫЙ КОД
  async generateSalt(rounds: number): Promise<string> {
    return await genSalt(rounds);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
  // ОБЩИЙ МЕТОД HASH
  async generateUserWithHashPass(dto: CreateUserDto) {
    const salt = await this.generateSalt(10);
    const hashedPassword = await this.hashPassword(dto.password, salt);
    return {
      ...dto,
      password: hashedPassword,
    };
  }
}
