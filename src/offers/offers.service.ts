import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  // TODO допилить логику с донатами, и наверно подгружать виши
  async create(user, createOfferDto: CreateOfferDto) {
    try {
      const savedOffer = await this.offerRepository.save({
        user,
        item: { id: createOfferDto.itemId },
        amount: createOfferDto.amount,
      });
      return savedOffer;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
