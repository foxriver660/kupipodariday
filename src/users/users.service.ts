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

  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const { password, ...result } = user;
    return result;
  }

  async findByUserName(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // TODO доделать после добавления связи
  findByUserWishes(username: string) {
    return `This action returns a #${username} user`;
  }
  // TODO доделать после добавления связи
  findMyWishes() {
    return `This action returns My Wishes`;
  }
}
