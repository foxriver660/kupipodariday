import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  login(@Body() loginAuthDto: LoginAuthDto) {
    console.log(`SIGNIN: ${loginAuthDto.email} ${loginAuthDto.password}`);
    return this.authService.login(loginAuthDto);
  }
  @Post('signup')
  register(@Body() createAuthDto: CreateAuthDto) {
    console.log(
      `SIGNUP: ${createAuthDto.name} ${createAuthDto.email} ${createAuthDto.password}`,
    );
    return this.authService.register(createAuthDto);
  }
}
