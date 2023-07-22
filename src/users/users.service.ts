import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserProfileResponseDto } from './dto/response-dto/user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findByIdOrName(
    value: number | string,
    key: 'id' | 'username',
  ): Promise<UserProfileResponseDto> {
    try {
      const { password, wishes, offers, wishlists, ...user } =
        await this.usersRepository.findOne({
          where: { [key]: value },
        });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByQuery(value: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          [value.includes('@') ? 'email' : 'username']: value,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, ...result } = user;
      return [result];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const genUpdate = updateUserDto.password
        ? await this.authService.generateUserWithHashPass<UpdateUserDto>(
            updateUserDto,
          )
        : updateUserDto;
      const updateResult = await this.usersRepository.update(id, genUpdate);
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wish');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserWishes(username: string) {
    try {
      const { wishes } = await this.usersRepository.findOne({
        where: { username },
        relations: ['wishes'],
      });
      if (!wishes) {
        throw new NotFoundException('User not found');
      }
      return wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
