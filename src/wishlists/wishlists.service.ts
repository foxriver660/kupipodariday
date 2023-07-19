import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    try {
      const savedWishlist = await this.wishlistRepository.save(
        createWishlistDto,
      );
      return savedWishlist;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const allWishlists = await this.wishlistRepository.find();
      return allWishlists;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      const findWishList = await this.wishlistRepository.findOne({
        where: { id },
      });
      if (!findWishList) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      return findWishList;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    try {
      const updateResult = await this.wishlistRepository.update(
        id,
        updateWishlistDto,
      );
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wish');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const removedWishList = await this.wishlistRepository.delete(id);
      if (removedWishList.affected !== 1) {
        throw new NotFoundException('Requested wishlist was not found');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
