import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
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
