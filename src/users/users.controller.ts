import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*  @Post('find')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('post users/find', createUserDto);
    return this.usersService.create(createUserDto);
  } */
  @Get('me')
  findMe() {
    console.log('get users/me');
    return this.usersService.findMe();
  }
  @Get('me/wishes')
  findMyWishes() {
    console.log('get users/me/wishes');
    return this.usersService.findMyWishes();
  }
  @Get(':username')
  findByUserName(@Param('username') username: string) {
    console.log('get users/:username', username);
    return this.usersService.findByUserName(username);
  }
  @Get(':username/wishes')
  findByUserWishes(@Param('username') username: string) {
    console.log('get users/:username/wishes', username);
    return this.usersService.findByUserWishes(username);
  }

  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto) {
    console.log('patch users/me', updateUserDto);
    return this.usersService.update(updateUserDto);
  }
}
