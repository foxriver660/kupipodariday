import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const { password, ...result } = user;
    return result;
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
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
