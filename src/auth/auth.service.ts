import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  register(createAuthDto: CreateAuthDto) {
    return `TEST REGISTER ${createAuthDto}`;
  }

  login(loginAuthDto: LoginAuthDto) {
    return `TEST REGISTER ${loginAuthDto}`;
  }
}
