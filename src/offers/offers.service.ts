import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsService } from 'src/errors/errors.service';
import { UserProfileResponseDto } from 'src/users/dto/response-dto/user-profile.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private readonly dataSource: DataSource,
    private readonly errorsService: ErrorsService,
  ) {}

  async create(user: UserProfileResponseDto, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.findById(createOfferDto.itemId, [
        'owner',
      ]);
      if (!wish) {
        throw new NotFoundException('Requested wish was not found');
      }
      if (user.id === wish.owner.id) {
        throw new BadRequestException('You cant spend money on your wishes');
      }
      if (wish.raised + createOfferDto.amount > wish.price) {
        throw new BadRequestException('Donate is too big, reduce the amount');
      }
      await this.wishesService.update(wish.id, {
        raised: createOfferDto.amount,
      });
      const savedOffer = await this.offerRepository.save({
        user,
        item: wish,
        amount: createOfferDto.amount,
      });
      await queryRunner.commitTransaction();
      return savedOffer;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorsService.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const allOffers = await this.offerRepository.find({
        relations: ['item', 'user'],
      });
      if (!allOffers) {
        throw new NotFoundException('Offers not found');
      }
      return allOffers;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }

  async findById(id: number) {
    try {
      const findOffer = await this.offerRepository.findOne({
        where: { id },
        relations: ['item', 'user'],
      });
      if (!findOffer) {
        throw new NotFoundException('Requested offer was not found');
      }
      return findOffer;
    } catch (error) {
      this.errorsService.handleError(error);
    }
  }
}
