import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user, createWishlistDto: CreateWishlistDto) {
    try {
      console.log(createWishlistDto.itemsId);
      const wishes = createWishlistDto.itemsId
        ? await this.wishesService.findWishesByIds(createWishlistDto.itemsId)
        : [];
      const savedWishlist = await this.wishlistRepository.save({
        items: wishes,
        owner: user,
        ...createWishlistDto,
      });
      return savedWishlist;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const allWishlists = await this.wishlistRepository.find({
        relations: ['owner', 'items'],
      });
      if (!allWishlists) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      return allWishlists;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number, relations?) {
    try {
      const wishlist = await this.wishlistRepository.findOne({
        where: { id },
        relations: relations,
      });
      if (!wishlist) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      return wishlist;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    try {
      const wishes = updateWishlistDto.itemsId
        ? await this.wishesService.findWishesByIds(updateWishlistDto.itemsId)
        : [];
      const updateResult = await this.wishlistRepository.update(id, {
        items: wishes,
        ...updateWishlistDto,
      });
      if (updateResult.affected === 0) {
        throw new InternalServerErrorException('Failed to update the wishlist');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(user, id: number) {
    try {
      const removedWishList = await this.findById(id);
      if (removedWishList) {
        throw new NotFoundException('Requested wishlist was not found');
      }
      if (user.id !== removedWishList.owner.id) {
        throw new ForbiddenException('You cant remove not your wishlist');
      }
      await this.wishlistRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
