import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  login(@Body() signinUserDto: SigninUserDto) {
    console.log(`SIGNIN: ${signinUserDto.email} ${signinUserDto.password}`);
    return this.authService.login(signinUserDto);
  }
  @Post('signup')
  register(@Body() createUserDto: CreateUserDto) {
    console.log(
      `SIGNUP: ${createUserDto.username} ${createUserDto.email} ${createUserDto.password}`,
    );
    return this.authService.register(createUserDto);
  }
}
