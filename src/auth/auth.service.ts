import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      return await this.usersRepository.save(createUserDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException(
          `User with same username or email already exists`,
        );
      } else {
        console.log(error);
      }
    }
  }

  login(signinUserDto: SigninUserDto) {
    return `TEST REGISTER`;
  }
}
