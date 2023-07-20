import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findBy<T>(value: number | string, key?: keyof T) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          [key ||
          (typeof value === 'string' && value.includes('@')
            ? 'email'
            : 'username')]: value,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, ...result } = user;
      return key ? result : [result];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        const genUser =
          await this.authService.generateUserWithHashPass<UpdateUserDto>(
            updateUserDto,
          );
        await this.usersRepository.update(id, genUser);
      } else {
        await this.usersRepository.update(id, updateUserDto);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserWishes(username: string) {
    try {
      const userWishes = await this.usersRepository.findOne({
        where: { username: username },
        relations: ['wishes'],
      });
      if (!userWishes) {
        throw new NotFoundException('User not found');
      }
      return userWishes.wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
