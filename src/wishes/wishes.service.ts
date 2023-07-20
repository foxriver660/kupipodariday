import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  // TODO подумать над owner сейчас сохраняется только id и username из пэйлоуда токена
  async create(user, createWishDto: CreateWishDto) {
    try {
      const owner = await this.usersService.findBy<User>(user.id, 'id');

      const savedWish = await this.wishRepository.save({
        owner: user,
        ...createWishDto,
      });
      console.log(owner);
      return savedWish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createCopy(user, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const copiedWish = await this.wishRepository.findOne({ where: { id } });
      if (!copiedWish) {
        throw new NotFoundException('The wish you want to copy was not found');
      }
      const {
        id: wishId,
        createdAt,
        updatedAt,
        raised,
        copied,
        ...result
      } = copiedWish;
      const savedWish = await this.wishRepository.save({
        ...result,
        owner: user,
      });
      if (!savedWish) {
        throw new InternalServerErrorException(
          'Failed to save a copy of the wish',
        );
      }

      const updateResult = await this.wishRepository.update(id, {
        copied: copiedWish.copied + 1,
      });
      if (updateResult.affected !== 1) {
        throw new InternalServerErrorException(
          'Failed to update the copied wish',
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findPopularWishes(sortOrder: 'ASC' | 'DESC'): Promise<Wish[]> {
    const order = { copied: sortOrder };
    try {
      const wishes = await this.wishRepository.find({ order });
      return wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //! скорее всего на удаление
  /*  async findWish(sortOrder: 'ASC' | 'DESC'): Promise<Wish[]> {
    const order = { createdAt: sortOrder };
    try {
      const wishes = await this.wishRepository.findOne({
        where: {},
        order,
      });
      return [wishes];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  } */

  async findById(id: number) {
    try {
      const findWish = await this.wishRepository.findOne({ where: { id } });
      if (!findWish) {
        throw new NotFoundException('Requested wish was not found');
      }
      return findWish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    try {
      const updateResult = await this.wishRepository.update(id, updateWishDto);
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wish');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(user, id: number) {
    try {
      const deletedWish = await this.findById(id);
      if (deletedWish) {
        throw new NotFoundException('Requested wish was not found');
      }
      if (user.id !== deletedWish.owner.id) {
        throw new ForbiddenException('You cant remove not your wish');
      }
      await this.wishRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
