import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto) {
    try {
      const savedWish = await this.wishRepository.save(createWishDto);
      return savedWish;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  createCopy(createWishDto: CreateWishDto) {
    return 'This action adds a new wish (COPY)';
  }
  findLast() {
    return `This action returns LAST wishes`;
  }
  findTop() {
    return `This action returns TOP wishes`;
  }
  findById(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
