import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  register(createUserDto: CreateUserDto) {
    return `TEST REGISTER`;
  }

  login(signinUserDto: SigninUserDto) {
    return `TEST REGISTER`;
  }
}
