import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findBy<T>(key: keyof T, value: number | string) {
    try {
      const userW = await this.usersRepository.findOne({
        where: { [key]: value },
        relations: ['wishes'],
      });
      console.log(userW.wishes);
      const user = await this.usersRepository.findOne({
        where: { [key]: value },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //! СТАРЫЙ КОД ПОТЕСТИТЬ УДАЛИТЬ
  /*  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const { password, ...result } = user;
    return result;
  }
  async findByUserName(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    const { password, ...result } = user;
    return result;
  } */

  async update(updateUserDto: UpdateUserDto, id: number) {
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
