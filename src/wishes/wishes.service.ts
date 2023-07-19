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

  async create(createWishDto: CreateWishDto) {
    try {
      const savedWish = await this.wishRepository.save(createWishDto);
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
  findLast() {
    return `This action returns LAST wishes`;
  }
  findTop() {
    return `This action returns TOP wishes`;
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

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
