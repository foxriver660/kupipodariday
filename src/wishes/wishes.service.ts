import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateRaiseWishDto } from './dto/update-raise-wish-copy.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(owner, createWishDto: CreateWishDto) {
    console.log(owner);
    try {
      const savedWish = await this.wishRepository.save({
        owner,
        ...createWishDto,
      });
      return savedWish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createCopy(owner, id: number) {
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
        owner,
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
    try {
      const order = { copied: sortOrder };
      const wishes = await this.wishRepository.find({ order });
      return wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findById(id: number, relations?) {
    try {
      const wish = await this.wishRepository.findOne({
        where: { id },
        relations: [relations],
      });
      if (!wish) {
        throw new NotFoundException('Requested wish was not found');
      }
      return wish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findWishesByIds(ids: number[]) {
    try {
      const wishes = await this.wishRepository.find({
        where: { id: In(ids) },
      });
      if (wishes.length !== ids.length) {
        const missingIds = ids.filter((id) => !wishes.some((e) => e.id === id));
        throw new NotFoundException(
          `Entities with ids ${missingIds} not found`,
        );
      }
      return wishes;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(id: number, updateWishDto: UpdateWishDto | UpdateRaiseWishDto) {
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
