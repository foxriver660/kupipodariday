import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(user, createWishDto: CreateWishDto) {
    try {
      const savedWish = await this.wishRepository.save({
        owner: user,
        ...createWishDto,
      });
      return savedWish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createCopy(id: number) {
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
      const savedWish = await this.wishRepository.save(result);
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
  // TODO непонятно по заданию либо ласт или отсортировано с ласта
  async findSortedWishes(sortOrder: 'ASC' | 'DESC'): Promise<Wish[]> {
    const order = { createdAt: sortOrder };
    try {
      const wishes = await this.wishRepository.find({ order });
      return wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // TODO непонятно по заданию либо ласт или отсортировано с ласта
  async findWish(sortOrder: 'ASC' | 'DESC'): Promise<Wish[]> {
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
  }

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

  async remove(id: number) {
    try {
      const removedWish = await this.wishRepository.delete(id);
      if (removedWish.affected !== 1) {
        throw new NotFoundException('Requested wish was not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
