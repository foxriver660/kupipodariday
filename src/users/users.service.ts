import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  /* create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  } */
  findMe() {
    return `This action returns Me`;
  }
  findMyWishes() {
    return `This action returns My Wishes`;
  }
  findByUserName(username: string) {
    return `This action returns a #${username} user`;
  }
  findByUserWishes(username: string) {
    return `This action returns a #${username} user`;
  }
  update(updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto.username} user`;
  }
}
