import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*  @Post('find')
  create(@Body() createUserDto: CreateUserDto) {
    console.log('post users/find', createUserDto);
    return this.usersService.create(createUserDto);
  } */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Request() { user: { id } }) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findByUserName(@Param('username') username: string) {
    console.log('get users/:username', username);
    return this.usersService.findByUserName(username);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('me')
  update(@Request() { user: { id } }, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // TODO доделать после добавления связи
  @Get('me/wishes')
  findMyWishes() {
    console.log('get users/me/wishes');
    return this.usersService.findMyWishes();
  }
  // TODO доделать после добавления связи
  @Get(':username/wishes')
  findByUserWishes(@Param('username') username: string) {
    console.log('get users/:username/wishes', username);
    return this.usersService.findByUserWishes(username);
  }
}
